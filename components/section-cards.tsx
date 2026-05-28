"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">

      {/* Total Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            {/* @ts-expect-error interestfor is a new HTML attribute not yet in React types */}
            <button className="trend-trigger trend-trigger-revenue" interestfor="tooltip-revenue">
              <Badge variant="outline">
                <TrendingUpIcon />
                +12.5%
              </Badge>
            </button>
            <div id="tooltip-revenue" popover="hint" className="trend-tooltip trend-tooltip-revenue">
              Up 12.5% compared to last month
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>

      {/* New Customers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            {/* @ts-expect-error interestfor is a new HTML attribute not yet in React types */}
            <button className="trend-trigger trend-trigger-customers" interestfor="tooltip-customers">
              <Badge variant="outline">
                <TrendingDownIcon />
                -20%
              </Badge>
            </button>
            <div id="tooltip-customers" popover="hint" className="trend-tooltip trend-tooltip-customers">
              Down 20% compared to last month
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>

      {/* Active Accounts */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            {/* @ts-expect-error interestfor is a new HTML attribute not yet in React types */}
            <button className="trend-trigger trend-trigger-accounts" interestfor="tooltip-accounts">
              <Badge variant="outline">
                <TrendingUpIcon />
                +12.5%
              </Badge>
            </button>
            <div id="tooltip-accounts" popover="hint" className="trend-tooltip trend-tooltip-accounts">
              Up 12.5% compared to last month
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>

      {/* Growth Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            {/* @ts-expect-error interestfor is a new HTML attribute not yet in React types */}
            <button className="trend-trigger trend-trigger-growth" interestfor="tooltip-growth">
              <Badge variant="outline">
                <TrendingUpIcon />
                +4.5%
              </Badge>
            </button>
            <div id="tooltip-growth" popover="hint" className="trend-tooltip trend-tooltip-growth">
              Up 4.5% compared to last month
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>

    </div>
  )
}
