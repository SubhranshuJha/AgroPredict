import Card from "../Components/Card.jsx";
import useTheme from "../contexts/theme.jsx"
import response from '../response_1775565278673.json'

function Home() {

  const { themeMode, toggleTheme } = useTheme();

  // const response = {
  //       historical: [
  //           {
  //               date: "2026-03-28",
  //               commodity: "Wheat",
  //               avg_price: 2447.805,
  //               min_price: 2178.79,
  //               max_price: 2716.82,
  //               modal_price: 2441.66
  //           }
  //       ],
  //       predictions: [
  //           {
  //               date: "2026-03-29",
  //               commodity: "Wheat",
  //               predicted_price: 2450.64
  //           }
  //       ],
  //   }
  const historicalData = response.historical.filter(commodity => commodity.date === "2026-03-28")
  const predictedData = response.predictions

  return (
    <div className="w-full min-h-screen">
      <div className="p-5 px-25 w-full min-h-11/12">
        <button
          className='bg-blue-400 mx-auto p-6 rounded-2xl'
          onClick={toggleTheme}
        >
          toggle( {themeMode} )
        </button>


        <div className=" mt-2 p-5 min-h-screen rounded-3xl shadow shadow-taupe-600 ">
          {/* <div className="flex flex-wrap "> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">            {
            historicalData.map((entity, index) => (
              <Card
                key={entity.commodity}
                historicalData={entity}
                predictedData={predictedData.find(item => item.commodity === entity.commodity)}
              />
            ))
          }
            {/* <Card
              historicalData={historicalData.find(item => item.commodity === 'Wheat')}
              predictedData={predictedData.find(item => item.commodity === 'Wheat')}
            /> */}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home
