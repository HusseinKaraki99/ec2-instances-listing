import { useEffect, useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap'
import './App.css';
import Input from './Components/Input';
import { IntanceService } from "./Storage_service/instance_service";

function App() {

  const [instances, setInstances] = useState([])
  const [data, setData] = useState([])
  const [number, setNumber] = useState([])
  const [unit, setUnit] = useState("RAM")


  let service = new IntanceService();


  //get data from db when rendering the page
  useEffect(() => {
    service.getInstances()
      .then(res => {
        setData(res)
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
  const favoriteHandler = (instance, index) => {
    const color = instance.color === "white" ? "yellow" : "white"
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
      <Container>
        <form className="form">
          <div>
            <Form.Label>Unit per USD</Form.Label>
            <Form.Select size="sm" aria-label="Default select example" onChange={(e) => setUnit(e.target.value)}>
              <option value="RAM">RAM</option>
              <option value="CPU">CPU</option>
            </Form.Select>
          </div>
          <div>
            <Input label="Number" type="number" placeholder="Name" onChange={(e) => { setNumber(e.target.value) }} />
          </div>
          <div className="btn-container">
            <Button variant="outline-dark" onClick={(e) => submitHandler(e)}>Submit</Button>
          </div>
        </form>
        <small>Click on instance to add it to favorites</small>
        <Table striped bordered hover size="sm">

          <thead>
            <tr>
              <th>Name</th>
              <th>RAM(GiB)</th>
              <th>vCPUs</th>
            </tr>
          </thead>
          <tbody>
            {instances.map((instance, index) => (
              <tr style={{ backgroundColor: instance.color }} key={instance.id} onClick={(e) => favoriteHandler(instance, index)}>
                <td>{instance.name}</td>
                <td>{instance.ram}</td>
                <td>{instance.cpu}</td>
              </tr>
            ))
            }
          </tbody>
        </Table>
      </Container>

    </div >
  );
}

export default App;
