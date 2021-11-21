import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap'
import './App.css';
import Input from './Components/Input';
import { Loader, ProgressLoader } from './Components/Loader/Loader';
import { IntanceService } from "./Storage_service/instance_service";
import { idbCon, getDatabase } from "./Storage_service/idb_service"
import axios from 'axios';

function App() {

  const [instances, setInstances] = useState([])
  const [data, setData] = useState([])
  const [count, setCount] = useState([])
  const [number, setNumber] = useState([])
  const [unit, setUnit] = useState("RAM")
  const [loader, setLoader] = useState(false)
  const [progressLoad, setProgressLoad] = useState(false)

  let service = new IntanceService();
  let dataBase = getDatabase();

  const initJsStore = (data) => {
    idbCon.initDb(dataBase).then(isCreated => {
      if (isCreated) {
        setLoader(false)
        setProgressLoad(true)
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (JSON.stringify(element.pricing) !== '{}' && element.instance_type.charAt(0) !== "t") {
            const instance = {
              name: element.pretty_name,
              ram: element.memory,
              cpu: element.vCPU,
              pricing: element.pricing,
            }
            idbCon.insert({
              into: "Instances",
              values: [instance],
              return: true
            }).then(() => {
              setCount(i)
            })

          }

        }
        console.log("db created");

      }
      else {
        setLoader(false)
        console.log("db opened");


      }
    })
      .then(() => {
        service.getInstances()
          .then(res => {
            setData(res)
            setProgressLoad(false)
            setLoader(false)
          })
      })
  }


  //get data from db when rendering the page
  useEffect(() => {
    setLoader(true)

    axios.get('https://raw.githubusercontent.com/vantage-sh/ec2instances.info/master/www/instances.json')
      .then(res => {
        initJsStore(res.data)
      })
      .catch(err => {
        initJsStore()
        console.log(err)
      })
  }, [])




  //sorting data according to user inputs
  const submitHandler = () => {

    if (number !== null) {
      if (unit === "RAM") {
        const sorting = data.sort((a, b) => {
          return b.ram / parseFloat(b.pricing["us-east-1"]["linux"]["ondemand"]) - a.ram / parseFloat(a.pricing["us-east-1"]["linux"]["ondemand"])
        })
        setInstances(sorting.slice(0, number))
      }
      else {
        const sorting = data.sort((a, b) => {
          return b.cpu / parseFloat(b.pricing["us-east-1"]["linux"]["ondemand"]) - a.cpu / parseFloat(a.pricing["us-east-1"]["linux"]["ondemand"])
        })
        setInstances(sorting.slice(0, number))
      }
    }
  }


  //change color of the favorite instance
  const favoriteHandler = (instance, index, color) => {

    const updatedData = {
      name: instance.name,
      color: color
    }
    service.updateInstanceById(instance.id, updatedData)
      .then(res => {
        const temp = [...instances]
        let temp_elm = temp[index]
        temp_elm.color = color;
        temp[index] = temp_elm
        setInstances(temp)

      })
  }


  return (
    <div className="App">

      {loader ? <Loader /> : progressLoad ? <ProgressLoader count={count * 100 / 402} /> :
        <React.Suspense fallback={<Loader />}>
          <Container>
            <form className="form">
              <div>
                <Form.Label>Unit</Form.Label>
                <Form.Select size="sm" aria-label="Default select example" onChange={(e) => setUnit(e.target.value)}>
                  <option value="RAM">RAM</option>
                  <option value="CPU">CPU</option>
                </Form.Select>
              </div>
              <div>
                <Form.Label>Number</Form.Label>
                <Input type="number" placeholder="Name" onChange={(e) => { setNumber(e.target.value) }} />
              </div>
              <div className="btn-container">
                <Button variant="outline-dark" onClick={(e) => submitHandler(e)}>Submit</Button>
              </div>
            </form>
            <Table bordered hover size="sm">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>RAM(GiB)</th>
                  <th>vCPUs</th>
                  <th>Mark as Favorite</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((instance, index) => (
                  <tr style={{ backgroundColor: instance.color }} key={instance.id} >
                    <td>{instance.name}</td>
                    <td>{instance.ram}</td>
                    <td>{instance.cpu}</td>
                    <td className="fav-row">
                      <span onClick={(e) => favoriteHandler(instance, index, "rgb(255, 77, 77)")} className="fav-color red"></span>
                      <span onClick={(e) => favoriteHandler(instance, index, "rgb(95, 255, 80)")} className="fav-color green"></span>
                      <span onClick={(e) => favoriteHandler(instance, index, "rgb(255, 255, 75)")} className="fav-color yellow"></span>
                      {instance.color !== null ? <span onClick={(e) => favoriteHandler(instance, index, null)} className="fav-color">X</span> : <span className="fav-color"></span>}
                    </td>
                  </tr>
                ))
                }
              </tbody>
            </Table>
          </Container>
        </React.Suspense>
      }
    </div >
  );
}

export default App;
