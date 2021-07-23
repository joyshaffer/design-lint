import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Menu from "./Menu";
import colorCodes from "../colors";
import typography from "../typography";
import effects from "../effects";
import _ from "lodash";

function ErrorList(props) {
  const handleIgnoreClick = error => {
    props.onIgnoredUpdate(error);
  };

  const handleIgnoreAll = error => {
    props.onIgnoreAll(error);
  };

  const handleSelectAll = error => {
    props.onSelectAll(error);
  };

  // Finds how many other nodes have this exact error.
  function countInstancesOfThisError(error) {
    let nodesToBeSelected = [];

    props.allErrors.forEach(node => {
      node.errors.forEach(item => {
        if (item.value === error.value) {
          if (item.type === error.type) {
            nodesToBeSelected.push(item.node.id);
          }
        }
      });
    });

    return nodesToBeSelected.length;
  }

  const variants = {
    initial: { opacity: 1, y: 10, scale: 1 },
    enter: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.8 }
  };

  // let showAcceptChangeButton = null;

  function displaySuggestedFix(error) {
    const _ = require("lodash");

    let errorValue = "";
    let foundTokenValue = "";
    let type = "";

    switch (error.type) {
      case "fill":
        type = "fill";
        errorValue = error.value.toUpperCase();
        if (errorValue) {
          foundTokenValue = _.find(colorCodes, errorValue);
        }
        break;
      case "stroke":
        type = "stroke";
        errorValue = error.value.slice(0, 7).toUpperCase();
        if (errorValue) {
          foundTokenValue = _.find(colorCodes, errorValue);
        }
        break;
      case "effects":
        type = "effects";
        errorValue = error.value;
        if (errorValue) {
          foundTokenValue = _.find(effects, errorValue);
        }
        break;
      case "text":
        type = "text";
        errorValue = error.value;
        if (errorValue) {
          foundTokenValue = _.find(typography, errorValue);
        }
        break;
      default:
        foundTokenValue = undefined;
    }

    if (foundTokenValue) {
      // showAcceptChangeButton = true;
      const tokenValue = foundTokenValue[errorValue];
      return `Change ${type} style to ${tokenValue}. Go to the right hand panel to make this adjustment.`;
    } else {
      // showAcceptChangeButton = false;
      return `The current ${type} style does not align with Spark. Please review the Spark Design Kit.`;
    }
  }

  // function onSuggestionAccepted() {
  //   console.log("Change Accepted");
  // }

  const errorListItems = props.errors.map((error, index) => (
    <motion.li
      positionTransition
      className="error-list-item"
      key={error.node.id + index}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <div className="flex-row">
        <span className="error-type">
          <img
            src={require("../assets/" + error.type.toLowerCase() + ".svg")}
          />
        </span>
        <span className="error-description">
          <div className="error-description__message">{error.message}</div>
        </span>
        <span className="context-icon">
          {countInstancesOfThisError(error) > 1 ? (
            <Menu
              error={error}
              menuItems={[
                {
                  label: `Select All (${countInstancesOfThisError(error)})`,
                  event: handleSelectAll
                },
                {
                  label: "Ignore",
                  event: handleIgnoreClick
                },
                {
                  label: "Ignore All",
                  event: handleIgnoreAll
                }
              ]}
            />
          ) : (
            <Menu
              error={error}
              menuItems={[
                {
                  label: "Ignore",
                  event: handleIgnoreClick
                },
                {
                  label: "Ignore All",
                  event: handleIgnoreAll
                }
              ]}
            />
          )}
        </span>
      </div>

      {error.value ? <div className="current-value">{error.value}</div> : null}

      <div className="panel-suggested-fix">
        <span className="suggested-heading">Suggested Fix:</span>
        <div className="suggested-body">
          <div>{displaySuggestedFix(error)}</div>
          {/* <div className="button-container">
            {showAcceptChangeButton ? (
              <button onClick={onSuggestionAccepted} className="accept-change">
                Accept Change
              </button>
            ) : null}
          </div> */}
        </div>
      </div>
    </motion.li>
  ));

  return (
    <AnimatePresence>
      <ul className="errors-list">{errorListItems}</ul>
    </AnimatePresence>
  );
}

export default React.memo(ErrorList);
