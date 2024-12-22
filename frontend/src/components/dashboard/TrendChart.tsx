import { Paper, Text, Group } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: Array<{ month: string; value: number }>;
  title: string;
  color?: string;
  valueLabel?: string;
  height?: number;
}

export function TrendChart({ 
  data, 
  title, 
  color = "#228be6", 
  valueLabel = "Valeur",
  height = 300
}: TrendChartProps) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: height }}>
      <Group position="apart" mb="xs">
        <Text 
          weight={500}
          sx={(theme) => ({
            fontSize: theme.fontSizes.sm,
            [theme.fn.smallerThan('sm')]: {
              fontSize: theme.fontSizes.xs,
            },
          })}
        >
          {title}
        </Text>
      </Group>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            width={40}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} ${valueLabel}`, title]}
            contentStyle={{ fontSize: '12px' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            name={title}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 