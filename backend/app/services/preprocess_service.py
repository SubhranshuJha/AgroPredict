import numpy as np
import pandas as pd


def create_wide_dataframe(df):

    # Pivot separately
    avg_df = df.pivot(index="Date", columns="Commodity", values="Avg_Price")
    min_df = df.pivot(index="Date", columns="Commodity", values="Min_Price")
    max_df = df.pivot(index="Date", columns="Commodity", values="Max_Price")
    modal_df = df.pivot(index="Date", columns="Commodity", values="Modal_Price")

    # Correct naming (VERY IMPORTANT)
    avg_df.columns = [f"{col}_Avg" for col in avg_df.columns]
    min_df.columns = [f"{col}_Min" for col in min_df.columns]
    max_df.columns = [f"{col}_Max" for col in max_df.columns]
    modal_df.columns = [f"{col}_Modal" for col in modal_df.columns]

    # Combine
    wide_df = pd.concat([avg_df, min_df, max_df, modal_df], axis=1)

    # Sort by date
    wide_df = wide_df.sort_index()

    # Fill missing dates
    full_range = pd.date_range(start=wide_df.index.min(), end=wide_df.index.max())
    wide_df = wide_df.reindex(full_range)

    # Fill missing values
    wide_df = wide_df.ffill().bfill()

    return wide_df


def add_time_series_features(wide_df):
    """Add date cyclic, lag, and moving-average features used by the newer models."""
    featured_df = wide_df.copy()
    index = pd.to_datetime(featured_df.index)

    feature_data = {
        "month_sin": np.sin(2 * np.pi * index.month / 12),
        "month_cos": np.cos(2 * np.pi * index.month / 12),
        "week_sin": np.sin(2 * np.pi * index.isocalendar().week.astype(int) / 52),
        "week_cos": np.cos(2 * np.pi * index.isocalendar().week.astype(int) / 52),
    }
    modal_cols = [col for col in featured_df.columns if col.endswith("_Modal")]
    for col in modal_cols:
        feature_data[f"{col}_lag7"] = featured_df[col].shift(7)
        feature_data[f"{col}_lag14"] = featured_df[col].shift(14)
        feature_data[f"{col}_ma3"] = featured_df[col].rolling(window=3, min_periods=1).mean()
        feature_data[f"{col}_ma7"] = featured_df[col].rolling(window=7, min_periods=1).mean()

    derived_df = pd.DataFrame(feature_data, index=featured_df.index)
    return pd.concat([featured_df, derived_df], axis=1).ffill().bfill().fillna(0)
