from __future__ import annotations

import argparse
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


def import_files(csv_files: list[Path]) -> None:
    db = SessionLocal()
    try:
        total_rows = 0
        for csv_file in csv_files:
            df = load_report_csv(csv_file)
            save_historical_data(db, df)
            total_rows += len(df)
            print(f"Imported {len(df)} rows from {csv_file}")

        print(f"Finished importing {total_rows} rows.")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Import Agmarknet historical CSV reports.")
    parser.add_argument("csv_files", nargs="+", help="One or more CSV files to import")
    args = parser.parse_args()

    csv_files = [Path(path).resolve() for path in args.csv_files]
    import_files(csv_files)


if __name__ == "__main__":
    main()
