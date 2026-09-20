export interface ChartSeries {
  label: string;
  unit?: string;
  values: number[];
  maximumFractionDigits?: number;
}

export interface CsvChartData {
  labels: string[];
  series: Record<string, ChartSeries>;
}

export interface ChartSeriesDefinition<Row> {
  key: string;
  label: string;
  unit?: string;
  maximumFractionDigits?: number;
  value: (row: Row) => number;
}

export function createChartData<Row>(
  rows: Row[],
  label: (row: Row) => string,
  definitions: ChartSeriesDefinition<Row>[],
): CsvChartData {
  return {
    labels: rows.map(label),
    series: Object.fromEntries(
      definitions.map((definition) => [
        definition.key,
        {
          label: definition.label,
          unit: definition.unit,
          values: rows.map(definition.value),
          maximumFractionDigits: definition.maximumFractionDigits,
        },
      ]),
    ),
  };
}
