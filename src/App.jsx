import SideBar from "./components/SideBar";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Not used but kept for consistency
    const [showModal, setShowModal] = useState(false);

    function handleToggleModal() {
        setShowModal(!showModal);
    }

    useEffect(() => {
        async function fetchAPIData() {
            const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
            const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`;
            const today = (new Date()).toDateString();
            const localkey=`NASA-${today}`
            if(localStorage.getItem(localkey)){
              const apiData = JSON.parse(localStorage.getItem(localkey))
              setData(apiData);
              return
            }
            localStorage.clear()

            try {
                const res = await fetch(url);
                const apiData = await res.json();
                localStorage.setItem(localkey, JSON.stringify(apiData));  // Store in local storage for next time to avoid API calls
                setData(apiData);
                console.log("API Data:", apiData); // Ensure data structure
            } catch (err) {
                console.error("Error fetching API data:", err.message);
            }
        }
        fetchAPIData();
    }, []);

    return (
        <>
            {data ? (
                <Main data={data} />
            ) : (
                <div className="loadingState">
                    <i className="fa-solid fa-gear"></i>
                </div>
            )}
            {showModal && <SideBar data={data} handleToggleModal={handleToggleModal} />}
            {data && <Footer data={data} handleToggleModal={handleToggleModal} />}
        </>
    );
}

export default App;
