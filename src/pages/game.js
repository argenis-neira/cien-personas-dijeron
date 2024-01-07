import { useState, useEffect } from "react";
import { Col, Row } from 'reactstrap';
import axios from 'axios';
import '../styles/game.css'

const Game = () => {

  const [values, setValues] = useState([])
  const [buzz, setBuzz] = useState("") //se envia el nombre de la persona
  const [firstBuzz, setFirstBuzz] = useState("")
  const [showWrong, setShowWrong] = useState(false)

  useEffect(() => {

    const getData = async () => {
      try {
        const response = await axios.get('https://argenisneira.pythonanywhere.com/get_values');
        // console.log(response.data)
        setValues(response.data.values)
        setFirstBuzz(JSON.parse(response.data.first).usuario)
        setShowWrong(response.data.wrong)
      }
      catch { }
    }

    const intervalo = setInterval(() => {
      // Aquí colocas la acción que quieres ejecutar cada segundo
      getData()
    }, 3000); // Intervalo de 1000 milisegundos (1 segundo)

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, []); // El segundo argumento vacío [] garantiza que se ejecute solo una vez al montar el componente

  //dividir en filas de x columnas
  const dividirEnFilas = (array, tamañoFila) => {
    const filas = [];
    for (let i = 0; i < array.length; i += tamañoFila) {
      filas.push(array.slice(i, i + tamañoFila));
    }
    return filas;
  };

  const filas = dividirEnFilas(values, 2);

  //handleBuzz
  const handleBuzz = async () => {
    await axios.post('https://argenisneira.pythonanywhere.com/buzz', { usuario: buzz })
  }



  return (
    <div className="custom-body">
      {showWrong && <span className="wrong">&#9746;</span>}
      <p style={{ color: "white", paddingTop: "2rem" }}>Hola Mundo</p>
      <Row>
        <Col><input type="text" onChange={(e) => setBuzz(e.target.value)} />
          <button type="button" style={{ marginLeft: "5px" }} onClick={handleBuzz}>BUZZ</button>
        </Col>
        <Col>
          <div className="miDiv">{firstBuzz}</div>
        </Col>
      </Row>
      {filas.map((fila, indice) => (
        <Row key={indice}>
          {fila.map((elemento, index) => (
            <Col key={index} md="6">
              {elemento.show ?
                <Row>
                  <Col md={8}>
                    <div className="example voltear" style={{ color: "white" }} id={`div-${indice * 2 + index + 1}`}>{elemento.word}</div>
                  </Col>
                  <Col md={2}>
                    <div className="sketchy">{elemento.score}</div>
                  </Col>
                </Row>
                :
                <Row>
                  <Col md={8}>
                    <div className="example" style={{ paddingRight: "100px", paddingLeft: "100px", }} id={`div-${indice * 2 + index + 1}`}>{indice * 2 + index + 1}</div>
                  </Col>
                  <Col md={2}>
                    <div className="sketchy sketchy-opaco"></div>
                  </Col>
                </Row>
              }
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
}

export default Game