import pandas as pd


def create_wide_dataframe(df):

    # 🔹 Pivot separately (IMPORTANT)
    avg_df = df.pivot(index="Date", columns="Commodity", values="Avg_Price")
    min_df = df.pivot(index="Date", columns="Commodity", values="Min_Price")
    max_df = df.pivot(index="Date", columns="Commodity", values="Max_Price")
    modal_df = df.pivot(index="Date", columns="Commodity", values="Modal_Price")

    # 🔹 Rename (MUST match training)
    avg_df.columns = [f"{col}_1" for col in avg_df.columns]
    min_df.columns = [f"{col}_2" for col in min_df.columns]
    max_df.columns = [f"{col}_3" for col in max_df.columns]
    modal_df.columns = [f"{col}_4" for col in modal_df.columns]

    # 🔹 Combine
    wide_df = pd.concat([avg_df, min_df, max_df, modal_df], axis=1)

    # 🔹 Sort by date
    wide_df = wide_df.sort_index()

    # 🔹 Fill missing dates
    full_range = pd.date_range(start=wide_df.index.min(), end=wide_df.index.max())
    wide_df = wide_df.reindex(full_range)

    # 🔹 Fill missing values (VERY IMPORTANT)
    wide_df = wide_df.ffill().bfill()

    return wide_df