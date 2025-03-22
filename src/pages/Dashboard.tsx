import React from "react";
import { motion } from "framer-motion";
import { ChartLine, Trophy, Users, Share, Clock, Coins, ArrowUp, DollarSign } from "lucide-react";

import { formatCurrency, formatNumber } from "../lib/utils";

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

// Mock data
const mockData = {
  user: {
    id: "user123",
    name: "Alex Thompson",
    avatarUrl: "https://i.pravatar.cc/150?u=alex123",
    cash: 3850,
    points: 1250,
    monthlyPoints: 250,
    rank: 8,
    recentReferrals: 3,
    weeklyGoal: 5,
    weeklyReferrals: 3,
    rankupPoints: 1240,
    nextRank: 7,
  },
  topReferrers: [
    { id: "r1", name: "Olivia Martinez", avatarUrl: "https://i.pravatar.cc/150?u=olivia123", points: 3200 },
    { id: "r2", name: "Michael Chen", avatarUrl: "https://i.pravatar.cc/150?u=michael123", points: 2100 },
    { id: "r3", name: "James Anderson", avatarUrl: "https://i.pravatar.cc/150?u=james123", points: 1560 },
  ],
  recentTransactions: [
    {
      id: "t1",
      name: "Sarah Johnson",
      avatarUrl: "https://i.pravatar.cc/150?u=sarah123",
      amount: 250,
      type: "credit" as const,
      date: "2h ago",
    },
  ],
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const Dashboard = () => {
  const { user, topReferrers, recentTransactions } = mockData;

  // Progress colors for weekly goals
  const getProgressColor = (achieved: boolean) => (achieved ? "bg-primary-500" : "bg-gray-200");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Referral Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your progress and boost your rewards!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="bg-blue-700 text-white overflow-hidden h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-white/20 mr-4">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-3 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Welcome back</p>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-600/40 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center text-blue-100 mb-1 text-sm">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>Cash</span>
                    </div>
                    <div className="text-2xl font-bold tracking-tight">₹ {formatNumber(user.cash)}</div>
                  </div>
                  <div className="bg-blue-600/40 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center text-blue-100 mb-1 text-sm">
                      <Coins className="h-4 w-4 mr-1" />
                      <span>Points</span>
                    </div>
                    <div className="text-2xl font-bold tracking-tight">{formatNumber(user.points)}</div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-blue-100 mt-6 mb-2">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+{user.monthlyPoints} points this month</span>
                </div>
                <div className="bg-white/10 h-2 w-full rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Card */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="border-none h-full bg-amber-50">
              <CardHeader>
                <CardTitle className="text-xl text-amber-900">Start earning more</CardTitle>
                <CardDescription className="text-amber-800">
                  Share with friends and earn up to 500 points per referral!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-6 h-auto text-base font-medium rounded-xl shadow-lg shadow-orange-500/20">
                    <Share className="mr-2 h-5 w-5" />
                    Make a Referral
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Card */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center">
                  <ChartLine className="h-5 w-5 text-blue-600 mr-2" />
                  <CardTitle>Your Weekly Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-center items-center mb-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-700">{user.weeklyReferrals}</div>
                    <div className="text-gray-500 text-lg font-medium mt-1">/{user.weeklyGoal}</div>
                    <div className="text-gray-500 mt-1">Referrals this week</div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="text-sm font-medium">Progress</div>
                      <div className="text-sm text-gray-500">
                        {Math.round((user.weeklyReferrals / user.weeklyGoal) * 100)}%
                      </div>
                    </div>
                    <Progress value={(user.weeklyReferrals / user.weeklyGoal) * 100} className="h-2.5" />
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-4">Weekly Goals</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div
                        className={`h-5 w-5 rounded-full ${getProgressColor(user.weeklyReferrals >= 1)} mr-3 flex items-center justify-center text-white text-xs`}
                      >
                        {user.weeklyReferrals >= 1 && "✓"}
                      </div>
                      <span className={user.weeklyReferrals >= 1 ? "text-gray-900" : "text-gray-500"}>
                        1 referral - 100 bonus points
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`h-5 w-5 rounded-full ${getProgressColor(user.weeklyReferrals >= 3)} mr-3 flex items-center justify-center text-white text-xs`}
                      >
                        {user.weeklyReferrals >= 3 && "✓"}
                      </div>
                      <span className={user.weeklyReferrals >= 3 ? "text-gray-900" : "text-gray-500"}>
                        3 referrals - 350 bonus points
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`h-5 w-5 rounded-full ${getProgressColor(user.weeklyReferrals >= 5)} mr-3 flex items-center justify-center text-white text-xs`}
                      >
                        {user.weeklyReferrals >= 5 && "✓"}
                      </div>
                      <span className={user.weeklyReferrals >= 5 ? "text-gray-900" : "text-gray-500"}>
                        5 referrals - 1000 bonus points
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Referrers Card */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                  <CardTitle>Top Referrers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {topReferrers.map((referrer, index) => (
                    <div key={referrer.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`flex items-center justify-center h-6 w-6 rounded-full ${index === 0 ? "bg-amber-100 text-amber-700" : index === 1 ? "bg-gray-100 text-gray-700" : "bg-amber-900/20 text-amber-900"} mr-3 text-sm font-semibold`}
                        >
                          #{index + 1}
                        </div>
                        <Avatar className="h-10 w-10 mr-3 border border-gray-200">
                          <AvatarImage src={referrer.avatarUrl} alt={referrer.name} />
                          <AvatarFallback>{referrer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{referrer.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatNumber(referrer.points)}</div>
                        <div className="text-gray-500 text-xs">points</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 rounded-lg p-4 mt-8 border border-amber-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xl text-amber-900">{user.rank}</div>
                      <div className="text-amber-800 text-sm">Your rank</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-xl text-amber-900">{formatNumber(user.rankupPoints)}</div>
                      <div className="text-amber-800 text-sm">to next rank</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Users className="mr-2 h-4 w-4" />
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Transactions Card */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <CardTitle>Recent Transactions</CardTitle>
              </div>
              <Button variant="link" className="text-blue-600 font-medium">
                View all
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3 border border-gray-200">
                        <AvatarImage src={transaction.avatarUrl} alt={transaction.name} />
                        <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.name}</div>
                        <div className="text-gray-500 text-sm">{transaction.date}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
