import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchTotalDonationsByMonth,
  fetchTotalUniqueDonors,
  fetchTotalRepeatedDonors,
  fetchTopDonors,
  fetchAverageDonationAmount,
  fetchDonationFrequency,
} from "../../../redux/store/donationAnalyticsSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  Title,
  Tooltip,
  Legend
);
Chart.register(ArcElement);

const DonationStatistics = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector(
    (state) => state.donationAnalytics || {}
  );

  useEffect(() => {
    dispatch(fetchTotalDonationsByMonth());
    dispatch(fetchTotalUniqueDonors());
    dispatch(fetchTotalRepeatedDonors());
    dispatch(fetchTopDonors());
    dispatch(fetchAverageDonationAmount());
    dispatch(fetchDonationFrequency());
  }, [dispatch]);

  // Prepare the chart data for Total Donations by Month

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top Donors",
      },
    },
  };

  // Prepare the chart data for Top Donors
  const topDonorsData = data.topdonors && {
    labels: data.topdonors.map((donor) => donor.name),
    datasets: [
      {
        label: "Top Donors",
        data: data.topdonors.map((donor) => donor.totalAmount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="">
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error loading the analytics data: {error}</p>}
      {status === "succeeded" && (
        <>
          <div className="w-full  ">
            {data.topdonors && data.topdonors.length > 0 && (
              <div className="border-2 p-4 h-full rounded-lg  bg-cyan-200 ">
                <h3 className="mb-2 text-lg text-center font-semibold">
                  Top Donors Pie Chart
                </h3>
                <Pie data={topDonorsData} options={pieOptions} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DonationStatistics;
