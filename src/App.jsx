import React, { useState } from "react";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';




export default function App() {
  let cont = 0;
  const [grammarInputs, setGrammarInputs] = useState([
    { entrada: "", saida: "" },
  ]);
  const [inputs] = useState([1]);
  const validate = (strInput) => {
    const str = strInput.target.value;
    const arr = grammarInputs.map((input) => {
      const temp = { ...input };
      temp.saida = temp.saida.replace(/\s+/g, "").split("|");
      return temp;
    });
    const res = [];
    let type = "";
    arr.forEach((row) => {
      row.saida.forEach((regra) => {
        if (regra.length > 1) {
          if (regra.replace(/[^A-Z]/g, "").length > 1) {
            res.push("Invalid");
          } else {
            for (let i = 0; i < regra.length; i++) {
              if (regra[i] === regra[i].toUpperCase() && i === 0) {
                res.push("Left");
                break;
              }
              if (regra[i] === regra[i].toUpperCase() && i === regra.length - 1) {
                res.push("Right");
                break;
              }
            }
          }
        }
      });
    });

    if (res.filter((s) => s === "Right").length === res.length) {
      type = "Right";
    } else if (res.filter((s) => s === "Left").length === res.length) {
      type = "Left";
    } else {
      type = "Invalid";
    }

    if (type === "Right") {
      for (let regra of arr[0].saida) {
        if (matchD(str, regra, arr)) {
          strInput.target.style.borderColor = "ForestGreen";
          return;
        }
      }
      strInput.target.style.borderColor = "FireBrick";
    } else if (type === "Left") {
      for (let regra of arr[0].saida) {
        if (matchE(str, regra, arr)) {
          strInput.target.style.borderColor = "ForestGreen";
          return;
        }
      }
      strInput.target.style.borderColor = "FireBrick";
    } else {
      alert("Erro");
      return;
    }
    return;
  };

  const matchD = (str, regra, arr) => {
    if (regra.length - 1 > str.length) return false;

    const nextregra = regra[regra.length - 1];
    if (
      nextregra === "λ" &&
      regra.slice(0, regra.length - 1) === str &&
      regra.slice(0, regra.length - 1).length === str.length
    )
      return true;

    if (nextregra === nextregra.toLowerCase()) return regra === str;

    if (
      regra.length > 1 &&
      regra.slice(0, regra.length - 1) !== str.slice(0, regra.length - 1)
    )
      return false;

    const regras = arr.find((row) => row.entrada === nextregra);

    if (!regras) return false;
    for (let r of regras.saida) {
      if (matchD(str, regra.replace(nextregra, r), arr)) {
        return true;
      }
    }
  };

  const matchE = (str, regra, arr) => {
    if (regra.length - 1 > str.length) return false;

    const nextregra = regra[0];

    if (
      nextregra === "λ" &&
      regra.slice(1, regra.length) === str &&
      regra.slice(1, regra.length).length === str.length
    )
      return true;

    if (nextregra === nextregra.toLowerCase()) return regra === str;

    if (
      regra.length > 1 &&
      regra.slice(1, regra.length) !==
      str.slice(str.length - (regra.length - 1), str.length)
    )
      return false;

    const regras = arr.find((row) => row.entrada === nextregra);

    if (!regras) return false;
    for (let r of regras.saida) {
      if (matchE(str, regra.replace(nextregra, r), arr)) {
        return true;
      }
    }
  };




  return (
    <Container maxWidth="lg" style={styles.container}>

      <div style={{ width: "100%" }}>
        <div style={{ width: "50%", float: "left" }}>

          <header style={styles.header}>
            <p style={styles.text}>Gramática</p>
          </header>

          <div style={styles.main}>
            {grammarInputs.map((input, key) => (
              <Gramatica
                key={`${input.entrada}-${key.toString()}`}
                grammar={grammarInputs}
                entrada={input.entrada}
                saida={input.saida}
                cont={cont++}
              />
            ))}
            <Tooltip title="Adicionar regra">
              <Button
                style={styles.button}
                onClick={() => {
                  if (grammarInputs.length < 8)
                    setGrammarInputs([
                      ...grammarInputs,
                      { entrada: "", saida: "" },
                    ]);
                }}
              >
                {" "}
                <AddIcon/>
                {" "}
              </Button>
            </Tooltip>
          </div>
          <div style={styles.main}>

          </div>
        </div>

        <div style={{ width: "45%", float: "left" }}>
          <header style={styles.header}>
            <p style={styles.text}>Teste</p>
          </header>
          <div style={styles.main}>
            {inputs.map((input, key) => (
              <div style={styles.item} key={key}>
                <input
                  type="text"
                  placeholder="String"
                  onChange={(strInput) => validate(strInput)}
                  onClick={(strInput) => {
                    validate(strInput);
                    strInput.target.placeholder = "";
                  }}
                  style={styles.input}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )

}

const Gramatica = ({ grammar, entrada, saida, cont }) => {
  const [inputs, setInputs] = useState([entrada, saida]);

  return (
    <div style={styles.item}>
      <input
        value={inputs[0]}
        style={styles.input2}
        onChange={(e) => {
          setInputs([e.target.value.toUpperCase(), inputs[1]]);
          grammar[cont].entrada = e.target.value.toUpperCase();
          grammar[cont].saida = inputs[1];
        }}
        maxLength={1}
        placeholder="Não terminal"
      />

      <ArrowForwardIosIcon />

      <input
        id={cont}
        value={inputs[1]}
        style={styles.input}
        onChange={(e) => {
          setInputs([inputs[0], e.target.value]);
          grammar[cont].entrada = inputs[0];
          grammar[cont].saida = e.target.value;
        }}
        placeholder="Regra"
      />
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#2B002B"
  },

  button: {
    borderRadius: "5px",
    height: "30px",
    width: "20px",
    marginTop: "10px",
    transitionDuration: "0.5s",
    marginRight: "10px",
    marginLeft: "10px",
    background: "white"
  },
  header: {
    paddingBottom: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  text: {
    fontSize: "30px",
    textAlign: "center",
    margin: "0",
  },

  main: {
    paddingBottom: "20px",
    margin: "0 auto",
    display: "flex",
    flexFlow: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  input: {
    borderWidth: "3px",
    borderColor: "white",
    borderStyle: "solid",
    height: "50px",
    width: "300px",
    outline: "0",
    fontSize: "20px",
    marginBottom: "10px",
    background: "rgba(0,0,0,0)"
  },
  input2: {
    borderWidth: "3px",
    borderColor: "white",
    borderStyle: "solid",
    height: "50px",
    width: "120px",
    outline: "0",
    fontSize: "20px",
    marginBottom: "10px",
    background: "rgba(0,0,0,0)"
  },
};
