import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Col, Row } from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewAllGames = ({ show, handleClose, selectGame }) => {
  const [dataLoaded, SetDataLoaded] = useState([]);

  useEffect(() => {
    const Get_Games = async () => {
      let gamesList = await axios.get(
        process.env.REACT_APP_API_URL + "/get_games"
      );
      SetDataLoaded(gamesList.data);
    };

    if (show) {
      Get_Games();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Please select your game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {dataLoaded.length === 0 ? (
          <div>Cargandooo....</div>
        ) : (
          dataLoaded.map((campo, index) => (
            <div key={index}>
              <Row style={{ border: "solid 2px blue", margin: "4px" }}>
                <Col>{campo.name}</Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={() => {
                      selectGame(campo.data);
                      handleClose();
                    }}
                  >
                    Select Game
                  </Button>
                </Col>
              </Row>
            </div>
          ))
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewAllGames;
