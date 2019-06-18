using Algorithm.KShortestPaths;
using Algorithm.KShortestPaths.Models;
using Core.Models;
using System;
using System.Collections.Generic;

namespace AlgorithmTest
{
    class Program
    {
        static void Main(string[] args)
        {
            //TestCase1();
            //TestCase2();
            //TestCase3();
            //TestCase4();
            TestCase5();
            //TestCase6();
        }

        static void TestCase1()
        {
            Console.WriteLine("TEST CASE 1");
            const int HCM = 1;
            const int HN = 2;
            const int DN = 3;

            List<Ticket> tickets = new List<Ticket>()
            {
                new Ticket()
                {
                    Id = 1,
                    DepartureStationId = HCM,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalStationId = HN,
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 2, hour: 8, minute: 0, second: 0),
                    SellingPrice = 1000000,
                },
                new Ticket()
                {
                    Id = 2,
                    DepartureStationId = HCM,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 9, minute: 0, second: 0),
                    ArrivalStationId = HN,
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 11, minute: 0, second: 0),
                    SellingPrice = 2000000,
                },
            };

            EppsteinGraph graph = new EppsteinGraph();
            foreach (var ticket in tickets)
            {
                graph.CreateEdgeFromTicketBaseOnPrice(ticket);
            }

            var shortestPath = graph.FindTheShortestPath(HCM, HN);
            Console.WriteLine(shortestPath.Trim().ToString());

            var path = new Path();
            do
            {
                path = graph.FindNextShortestPath();
                if (path.IsValid)
                {
                    Console.WriteLine(path.Trim().ToString());
                }
            } while (path.IsValid);
            Console.WriteLine("--Graph:");
            Console.WriteLine(graph.ToString());
            Console.WriteLine("----------------");
        }

        static void TestCase2()
        {
            Console.WriteLine("TEST CASE 2");
            const int HCM = 1;
            const int HN = 2;
            const int DN = 3;

            List<Ticket> tickets = new List<Ticket>()
            {
                new Ticket()
                {
                    Id = 1,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 20, minute: 0, second: 0),
                    SellingPrice = 1000000,
                },
                new Ticket()
                {
                    Id = 2,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 20, minute: 0, second: 0),
                    SellingPrice = 2000000,
                },
                new Ticket()
                {
                    Id = 3,
                    DepartureStationId = HCM,
                    ArrivalStationId = DN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 20, minute: 0, second: 0),
                    SellingPrice = 500000,
                }
            };

            EppsteinGraph graph = new EppsteinGraph();
            foreach (var ticket in tickets)
            {
                graph.CreateEdgeFromTicketBaseOnPrice(ticket);
            }

            var shortestPath = graph.FindTheShortestPath(HCM, HN);
            Console.WriteLine(shortestPath.Trim().ToString());

            var path = new Path();
            do
            {
                path = graph.FindNextShortestPath();
                if (path.IsValid)
                {
                    Console.WriteLine(path.Trim().ToString());
                }
            } while (path.IsValid);
            Console.WriteLine("--Graph:");
            Console.WriteLine(graph.ToString());
            Console.WriteLine("----------------");
        }

        static void TestCase3()
        {
            Console.WriteLine("TEST CASE 3");
            const int HCM = 1;
            const int HN = 2;
            const int DN = 3;

            List<Ticket> tickets = new List<Ticket>()
            {
                new Ticket()
                {
                    Id = 1,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 20, minute: 0, second: 0),
                    SellingPrice = 1000000,
                },
                new Ticket()
                {
                    Id = 2,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 8, minute: 0, second: 0),
                    SellingPrice = 2000000,
                },
                new Ticket()
                {
                    Id = 3,
                    DepartureStationId = HCM,
                    ArrivalStationId = DN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 8, minute: 0, second: 0),
                    SellingPrice = 500000,
                },
                new Ticket()
                {
                    Id = 4,
                    DepartureStationId = DN,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 10, minute: 0, second: 0),
                    SellingPrice = 500000,
                }
            };

            EppsteinGraph graph = new EppsteinGraph();
            foreach (var ticket in tickets)
            {
                graph.CreateEdgeFromTicketBaseOnPrice(ticket);
            }
            Console.WriteLine("--Graph:");
            Console.WriteLine(graph.ToString());

            var shortestPath = graph.FindTheShortestPath(HCM, HN);
            Console.WriteLine(shortestPath.Trim().ToString());

            var path = new Path();
            do
            {
                path = graph.FindNextShortestPath();
                if (path.IsValid)
                {
                    Console.WriteLine(path.Trim().ToString());
                }
            } while (path.IsValid);
            Console.WriteLine("--Graph:");
            Console.WriteLine(graph.ToString());
            Console.WriteLine("----------------");

        }

        static void TestCase4()
        {
            Console.WriteLine("TEST CASE 4");
            const int HCM = 1;
            const int HN = 2;
            const int DN = 3;

            List<Ticket> tickets = new List<Ticket>()
            {
                new Ticket()
                {
                    Id = 1,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 20, minute: 0, second: 0),
                    SellingPrice = 1000000,
                },
                new Ticket()
                {
                    Id = 2,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 9, minute: 0, second: 0),
                    SellingPrice = 2000000,
                },
                new Ticket()
                {
                    Id = 3,
                    DepartureStationId = HCM,
                    ArrivalStationId = DN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 8, minute: 0, second: 0),
                    SellingPrice = 400000,
                },
                new Ticket()
                {
                    Id = 4,
                    DepartureStationId = DN,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 9, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 10, minute: 0, second: 0),
                    SellingPrice = 500000,
                }
            };

            EppsteinGraph graph = new EppsteinGraph();
            foreach (var ticket in tickets)
            {
                graph.CreateEdgeFromTicketBaseOnPrice(ticket);
            }
            Console.WriteLine("--Graph:");
            Console.WriteLine(graph.ToString());

            var shortestPath = graph.FindTheShortestPath(HCM, HN);
            Console.WriteLine(shortestPath.Trim().ToString());

            var path = new Path();
            do
            {
                path = graph.FindNextShortestPath();
                if (path.IsValid)
                {
                    Console.WriteLine(path.Trim().ToString());
                }
            } while (path.IsValid);
            Console.WriteLine("--Graph:");
            Console.WriteLine(graph.ToString());
            Console.WriteLine("----------------");

        }

        static void TestCase5()
        {
            Console.WriteLine("TEST CASE 5");
            const int HCM = 1;
            const int HN = 2;
            const int DN = 3;

            List<Ticket> tickets = new List<Ticket>()
            {
                new Ticket()
                {
                    Id = 1,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 15, minute: 0, second: 0),
                    SellingPrice = 1000000,
                },
                new Ticket()
                {
                    Id = 2,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 9, minute: 0, second: 0),
                    SellingPrice = 2000000,
                },
                new Ticket()
                {
                    Id = 3,
                    DepartureStationId = HCM,
                    ArrivalStationId = DN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 7, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 8, minute: 0, second: 0),
                    SellingPrice = 400000,
                },
                new Ticket()
                {
                    Id = 4,
                    DepartureStationId = DN,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 9, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 10, minute: 0, second: 0),
                    SellingPrice = 500000,
                },
                new Ticket()
                {
                    Id = 5,
                    DepartureStationId = DN,
                    ArrivalStationId = HN,
                    DepartureDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 8, minute: 0, second: 0),
                    ArrivalDateTime = new DateTime(year: 2019, month: 6, day: 1, hour: 10, minute: 0, second: 0),
                    SellingPrice = 400000,
                }
            };

            EppsteinGraph graph = new EppsteinGraph();
            foreach (var ticket in tickets)
            {
                graph.CreateEdgeFromTicketBaseOnPrice(ticket);
            }

            var shortestPath = graph.FindTheShortestPath(HCM, HN);
            Console.WriteLine(shortestPath.Trim().ToString());

            var path = new Path();
            do
            {
                path = graph.FindNextShortestPath();
                if (path.IsValid)
                {
                    Console.WriteLine(path.Trim().ToString());
                }
            } while (path.IsValid);
            Console.WriteLine("--Graph:");
            Console.WriteLine(graph.ToString());
            Console.WriteLine("----------------");

        }

        static void TestCase6()
        {
            Console.WriteLine("TEST CASE 6");
            const int HCM = 1;
            const int HN = 2;
            const int DN = 3;
            const int DL = 4;

            List<Ticket> tickets = new List<Ticket>()
            {
                new Ticket()
                {
                    Id = 1,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    SellingPrice = 1000000,
                },
                new Ticket()
                {
                    Id = 2,
                    DepartureStationId = HCM,
                    ArrivalStationId = HN,
                    SellingPrice = 2000000,
                },
                new Ticket()
                {
                    Id = 3,
                    DepartureStationId = HCM,
                    ArrivalStationId = DN,
                    SellingPrice = 400000,
                },
                new Ticket()
                {
                    Id = 4,
                    DepartureStationId = DN,
                    ArrivalStationId = HN,
                    SellingPrice = 500000,
                },
                new Ticket()
                {
                    Id = 5,
                    DepartureStationId = DN,
                    ArrivalStationId = HN,
                    SellingPrice = 400000,
                },
                new Ticket()
                {
                    Id = 6,
                    DepartureStationId = HN,
                    ArrivalStationId = DN,
                    SellingPrice = 10000,
                },
                new Ticket()
                {
                    Id = 7,
                    DepartureStationId = HCM,
                    ArrivalStationId = DL,
                    SellingPrice = 200000,
                },
                new Ticket()
                {
                    Id = 8,
                    DepartureStationId = DL,
                    ArrivalStationId = DN,
                    SellingPrice = 200000,
                },
                new Ticket()
                {
                    Id = 9,
                    DepartureStationId = DN,
                    ArrivalStationId = HCM,
                    SellingPrice = 20000,
                }
            };

            EppsteinGraph graph = new EppsteinGraph();
            foreach (var ticket in tickets)
            {
                graph.CreateEdgeFromTicketBaseOnPrice(ticket);
            }

            var shortestPath = graph.FindTheShortestPath(HCM, HN, kShortestPathQuantity: 50);
            Console.WriteLine(shortestPath.Trim().ToString());

            var path = new Path();
            do
            {
                path = graph.FindNextShortestPath();
                if (path.IsValid)
                {
                    Console.WriteLine(path.Trim().ToString());
                }
            } while (path.IsValid);
            Console.WriteLine("--Graph:");
            Console.WriteLine(graph.ToString());
            Console.WriteLine("----------------");

        }
    }
}
