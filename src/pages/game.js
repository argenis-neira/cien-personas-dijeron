import { useState, useEffect } from "react";
import { Col, Row } from 'reactstrap';
import axios from 'axios';
import '../styles/game.css'

const Game = () => {

  const [values, setValues] = useState([])
  const [buzz, setBuzz] = useState("") //se envia el nombre de la persona
  const [firstBuzz, setFirstBuzz] = useState("")
  const [showWrong, setShowWrong] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {

    const getData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + '/get_values');
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

  const handleText = async (value) => {
    setBuzz(value)
    if (value !== "") setIsEmpty(true)
    else setIsEmpty(false)

  }

  //handleBuzz
  const handleBuzz = async () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 700);
    await axios.post(process.env.REACT_APP_API_URL + '/buzz', { usuario: buzz })
  }



  return (
    <div className="another-custom-body">
      <div className={+showWrong !== 0 ? "divWrong" : ""}>
        {Array.from({ length: showWrong }, (_, index) => index + 1).map((fila, index) => (<span className="wrong" key={index}>&#9746;</span>))}
      </div>
      <Row>
        <Col>
          <div className="miDiv">{firstBuzz === "" ? <div>&nbsp;</div> : firstBuzz}</div>
        </Col>
      </Row>
      <Row>
        <Col md={7} sm={7} xs={7}>
          <div className="Input">
            <input type="text" className="Input-text" placeholder="Your nickname" onChange={(e) => handleText(e.target.value)} />
          </div>
        </Col>
        {isEmpty
          &&
          <Col md={2} sm={2} xs={2} style={{ display: "flex", justifyContent: "start" }}>
            <button type="button" className={animate ? "bubbly-button animate" : "bubbly-button"} style={{ marginLeft: "5px" }} onClick={handleBuzz}>BUZZ</button>
          </Col>}
      </Row>
      {filas.map((fila, indice) => (
        <Row key={indice}>
          {fila.map((elemento, index) => (
            <Col key={index} md="6">
              {elemento.show ?
                <Row>
                  <Col md={8} sm={8} xs={8}>
                    <div className="example voltear" style={{ color: "white" }} id={`div-${indice * 2 + index + 1}`}>{elemento.word}</div>
                  </Col>
                  <Col md={2} sm={2} xs={2}>
                    <div className="sketchy">{elemento.score}</div>
                  </Col>
                </Row>
                :
                <Row>
                  <Col md={8} sm={8} xs={8}>
                    <div className="example" style={{ paddingRight: "100px", paddingLeft: "100px", }} id={`div-${indice * 2 + index + 1}`}>{indice * 2 + index + 1}</div>
                  </Col>
                  <Col md={2} sm={2} xs={2}>
                    <div className="sketchy sketchy-opaco"></div>
                  </Col>
                </Row>
              }
            </Col>
          ))}
        </Row>
      ))}
      <style>
        {`body {
  width: 100% !important;
  height: 100%;
  position: relative;
  z-index: 0;
  text-align: center;
  background-image: linear-gradient(
      rgba(50, 219, 240, 0.9),
      rgba(50, 219, 240, 0.9)
    ),
    url("/static/media/fondo-azul-grunge-abstracto_107146-184.1e0ebc62b14e82a0667d.avif");
  background-size: contain;
  background-repeat: repeat;
}`}
      </style>
    </div>
  );
}

export default Game