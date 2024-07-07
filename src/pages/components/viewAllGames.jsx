import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Col, Row } from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewAllGames = ({ show, handleClose, selectGame, setTitle, formik }) => {
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
    <Modal show={show} onHide={handleClose} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>Please select your game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {dataLoaded.length === 0 ? (
          <div>Cargandooo....</div>
        ) : (
          dataLoaded.map((campo, index) => (
            <div key={index}>
              <Row
                style={{
                  border: "solid 2px blue",
                  margin: "4px",
                  position: "relative",
                }}
              >
                <Col>
                  {campo.name +
                    " - (" +
                    Object.keys(campo.data).length / 3 +
                    ")"}
                </Col>
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
                      formik.handleReset();
                      selectGame(campo.data);
                      setTitle(campo.name);
                      axios.put(
                        process.env.REACT_APP_API_URL +
                          `/update_tag/${campo._id}`
                      );
                      handleClose();
                      SetDataLoaded([]);
                    }}
                  >
                    Select Game
                  </Button>
                </Col>
                {campo.new && (
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "-2px",
                      backgroundColor: "#f44336",
                      color: "white",
                      padding: "5px 5px",
                      borderRadius: "3px",
                      width: "fit-content",
                      fontSize: "10px",
                      transform: "rotate(35deg)",
                    }}
                  >
                    NEW
                  </span>
                )}
              </Row>
            </div>
          ))
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewAllGames;
