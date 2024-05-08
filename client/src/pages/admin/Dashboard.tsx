import axios from "axios";
import { useEffect } from "react";
import { FaUserPlus } from "react-icons/fa6"

import 
{ BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
from 'recharts';
import { BASE_URL } from "../../config";
import { Failed, Start, Success } from "../../slices/admin/dashboardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Error from "../../components/Error";




const Dashboard = () => {

  const dispatch = useAppDispatch();

  const {token} = useAppSelector(state => state.admin);

  const authToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const fetchData = async() => {
      dispatch(Start());
      await axios.get(`${BASE_URL}/admin/dashboardData`,authToken).
      then((res) => {
        const {data} = res.data;
        dispatch(Success(data))
      })
      .catch((err) => {
          dispatch(Failed(err.response.data.message));
          toast.error(err.response.data.message)
      })
    }
    fetchData();
  },[]);

  const {dashData,loading,error} = useAppSelector(state => state.dashData);

 
 //barchart data 
 const barChart = dashData?.barChartData && dashData.barChartData.map(item => ({
  name: item.month,
  approved: item.approved,
  cancelled: item.cancelled,
  amt: Number(item.approved) + Number(item.cancelled)
}));
   

const lineChart = dashData?.lineChartData && dashData.lineChartData.map(item => ({
  name: item.month,
  doctorTicket: item.ticketPrice,
  extraCharge: item.extraCharges,
  totalRevenue: item.totalCharges,
  amt : item.totalCharges
}))

  return (
    <main className="main-container">
      {loading && !error && <Loader/>}
      {error && !loading && <Error errorMessage={error}/>}
      {!loading && !error && (
      <><div className="main-title">
          <h3>DASHBOARD</h3>
        </div><div className="main-cards">
            <div className="card">
              <div className="card-inner">
                <h3>PATIENTS</h3>
                <FaUserPlus className="cards_icon" />
              </div>
              <h1>{dashData?.patients}</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>DOCTORS</h3>
                <FaUserPlus className="cards_icon" />
              </div>
              <h1>{dashData?.doctors}</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>BOOKINGS</h3>
                <FaUserPlus className="cards_icon" />
              </div>
              <h1>{dashData?.bookings}</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>CANCELLED</h3>
                <FaUserPlus className="cards_icon" />
              </div>
              <h1>{dashData?.cancelled}</h1>
            </div>
          </div><div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={barChart}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="#008000" />
                <Bar dataKey="cancelled" fill=" #FF0000" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={lineChart}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="doctorTicket" stroke="#82ca9d" />
                <Line type="monotone" dataKey="extraCharge" stroke="#FFC733" />
              </LineChart>
            </ResponsiveContainer>

          </div></>
      )}

    </main>
  )
}

export default Dashboard
