from __future__ import annotations

import argparse
from datetime import timedelta
from pathlib import Path

import pandas as pd

from app.config.database import SessionLocal
from app.utils.save_data_to_db import save_historical_data


def _find_column(columns: list[str], prefix: str) -> str:
    for column in columns:
        if column.startswith(prefix):
            return column
    raise ValueError(f"Missing expected column starting with: {prefix}")


def load_report_csv(csv_path: Path) -> pd.DataFrame:
    df = pd.read_csv(csv_path, skiprows=1)
    columns = list(df.columns)

    min_col = _find_column(columns, "Min Price ")
    modal_col = _find_column(columns, "Modal Price ")
    max_col = _find_column(columns, "Max Price ")

    df = df.rename(columns={
        "Commodity": "Commodity",
        "Date": "Date",
        min_col: "Min_Price",
        modal_col: "Modal_Price",
        max_col: "Max_Price",
    })

    required_columns = ["Commodity", "Date", "Min_Price", "Modal_Price", "Max_Price"]
    df = df[required_columns].copy()

    df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y", errors="coerce")
    for col in ["Min_Price", "Modal_Price", "Max_Price"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=["Date", "Commodity", "Modal_Price"])
    df["Avg_Price"] = (df["Min_Price"] + df["Max_Price"]) / 2

    df = df.groupby(["Date", "Commodity"], as_index=False).agg({
        "Avg_Price": "mean",
        "Min_Price": "mean",
        "Max_Price": "mean",
        "Modal_Price": "mean",
    })

    return df.sort_values(by="Date")


def keep_last_days(df: pd.DataFrame, days: int) -> pd.DataFrame:
    if df.empty:
        return df
    latest_date = df["Date"].max()
    cutoff_date = latest_date - timedelta(days=max(days, 1) - 1)
    return df[df["Date"] >= cutoff_date].copy()


def import_recent(data_dir: Path, days: int, latest_file_only: bool) -> None:
    csv_files = sorted(data_dir.glob("*.csv"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in: {data_dir}")

    selected_files = csv_files[:1] if latest_file_only else csv_files

    db = SessionLocal()
    try:
        total_rows = 0
        for csv_file in selected_files:
            df = load_report_csv(csv_file)
            recent_df = keep_last_days(df, days=days)
            save_historical_data(db, recent_df)
            total_rows += len(recent_df)
            print(f"Imported {len(recent_df)} rows from {csv_file.name} (last {days} day(s))")

        print(f"Finished importing {total_rows} rows.")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import only the most recent N days from CSV files in backend/app/data."
    )
    parser.add_argument("--days", type=int, default=7, help="Number of latest days to import (default: 7)")
    parser.add_argument(
        "--all-files",
        action="store_true",
        help="Import from all CSV files in data folder. Default: latest file only.",
    )
    args = parser.parse_args()

    data_dir = Path(__file__).resolve().parent / "data"
    import_recent(data_dir=data_dir, days=max(args.days, 1), latest_file_only=not args.all_files)


if __name__ == "__main__":
    main()
