import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FormControl } from "@mui/material";
import { MenuItem, TextField } from "@mui/material";
import { months } from "../../util/constant";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "@mui/material/Modal";
import "./BGCProfileHome.css";
import { useForm } from "../../hooks/useForm";

const ModelWindow = ({
  profile = "",
  setOpenModel,
  openModel,
  type,
  indexToModal = "none",
  modeType,
  origin,
  setSummary = "",
  setExpierenceTest = "",
  setEducationTest = "",
  setProfile,
}) => {
  const [dates, setDates] = useState({});
  const [initialState, setInitialState] = useState({});
  const { startMonth, startYear, endMonth, endYear } = dates;
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (profile.endMonth === "Present") {
      setChecked(true);
    }
  }, [profile]);

  useEffect(() => {
    if (modeType === "Edit") {
      setDates({
        ...dates,
        endMonth: profile.endMonth === "Present" ? "january" : profile.endMonth,
        endYear:
          profile.endYear === "Present"
            ? new Date()
            : new Date(profile.endYear, 6),
      });
    } else {
      setDates({
        startMonth: "january",
        startYear: new Date(),
        endMonth: "january",
        endYear: new Date(),
      });
    }
  }, [profile]);

  useEffect(() => {
    if (type === "summary") {
      setInitialState({
        description: profile.updatedDescription,
      });
    } else if (type === "workforce") {
      setInitialState({
        jobTtile: modeType === "Edit" ? profile.jobTtile : "",
        company: modeType === "Edit" ? profile.company : "",
        description: modeType === "Edit" ? profile.description : "",
      });
    } else if (type === "education") {
      setInitialState({
        fieldOfStudy: modeType === "Edit" ? profile.fieldOfStudy : "",
        university: modeType === "Edit" ? profile.university : "",
        location: modeType === "Edit" ? profile.location : "",
      });
    }
  }, [modeType]);


  const [state, handleInputChange, render] = useForm(initialState);

  useEffect(() => {
    render(initialState);
    if (modeType === "Edit") {
      setDates({
        startMonth: profile.startMonth,
        startYear: new Date(profile.startYear, 6),
        endMonth: profile.endMonth === "Present" ? "january" : profile.endMonth,
        endYear:
          profile.endYear === "Present"
            ? new Date()
            : new Date(profile.endYear, 6),
      });
    }
  }, [initialState, profile]);

  useEffect(() => {
    const monthsArray = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    if (Object.keys(dates).length > 0) {
      if (endMonth === "Present") {
        setBtnDisabled(false);
      } else {
        const startMonthIndex = monthsArray.indexOf(startMonth);
        const endMonthIndex = monthsArray.indexOf(endMonth);
        const firstDate = new Date(startYear.getFullYear(), startMonthIndex);
        const endDate = new Date(endYear.getFullYear(), endMonthIndex);

        if (firstDate > endDate) {
          setBtnDisabled(true);
        } else {
          setBtnDisabled(false);
        }
      }
    }
  }, [dates]);

  const renderContent = () => {
    if (type === "summary") {
      return (
        <TextField
          id="outlined-multiline-static"
          label="Summary"
          className="model__window__description__short"
          multiline
          onChange={handleInputChange}
          value={state.description}
          name="description"
          fullWidth
        />
      );
    } else if (type === "workforce" || type === "education") {
      return (
        <>
          <TextField
            id="outlined-multiline-static"
            label={`${type === "workforce" ? "Title" : "Field of Study"}`}
            onChange={handleInputChange}
            value={
              state[`${type === "workforce" ? "jobTtile" : "fieldOfStudy"}`]
            }
            name={`${type === "workforce" ? "jobTtile" : "fieldOfStudy"}`}
            fullWidth
          />
          <TextField
            id="outlined-multiline-static"
            label={`${
              type === "workforce" ? "Company" : "College or University"
            }`}
            onChange={handleInputChange}
            value={state[`${type === "workforce" ? "company" : "university"}`]}
            name={`${type === "workforce" ? "company" : "university"}`}
            fullWidth
          />
          {type === "workforce" ? (
            <TextField
              id="outlined-multiline-static"
              label={`${
                type === "workforce" ? "Short Description" : "Location"
              }`}
              onChange={handleInputChange}
              value={
                state[`${type === "workforce" ? "description" : "location"}`]
              }
              name={`${type === "workforce" ? "description" : "location"}`}
              multiline
              className="model__window__description__short"
              fullWidth
            />
          ) : (
            <TextField
              id="outlined-multiline-static"
              label={`${
                type === "workforce" ? "Short Description" : "Location"
              }`}
              onChange={handleInputChange}
              value={
                state[`${type === "workforce" ? "description" : "location"}`]
              }
              name={`${type === "workforce" ? "description" : "location"}`}
              fullWidth
            />
          )}

          <React.Fragment>
            <div className="model__window__btns">
              <div className="col1">
                <FormControl className="step4__section_Selection">
                  <TextField
                    fullWidth
                    id="step4_startYear"
                    className="step4__section_Month_mdw"
                    select
                    value={startMonth}
                    onChange={(e) => {
                      setDates({
                        ...dates,
                        startMonth: e.target.value,
                      });
                    }}
                    variant="outlined"
                    label="Start Month"
                  >
                    {months.map((item) => (
                      <MenuItem value={item.value}>{item.name}</MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </div>
              <div className="col2">
                <FormControl className="step4__section_Selection">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={["year"]}
                      label="Start Year"
                      value={startYear}
                      onChange={(newValue) => {
                        setDates({
                          ...dates,
                          startYear: newValue,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col3">
                <FormControl className="step4__section_Selection">
                  <TextField
                    fullWidth
                    id="step4_startYear"
                    className="step4__section_Month_mdw"
                    select
                    value={endMonth}
                    onChange={(e) => {
                      setDates({
                        ...dates,
                        endMonth: e.target.value,
                      });
                    }}
                    variant="outlined"
                    label="End Month"
                    InputLabelProps={{
                      shrink: endMonth ? true : false,
                    }}
                    disabled={checked}
                  >
                    {months.map((item) => (
                      <MenuItem value={item.value}>{item.name}</MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </div>
              <div className="col4">
                <FormControl className="step4__section_Selection">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={["year"]}
                      label="End Year"
                      value={endYear}
                      onChange={(newValue) => {
                        setDates({
                          ...dates,
                          endYear: newValue,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                      )}
                      er
                      disabled={checked}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col5">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleCheckChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Present"
                />
              </div>
            </div>
          </React.Fragment>
        </>
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "summary") {
      setSummary({
        description: state.description,
      });
    } else if (type === "workforce" || type === "education") {
      if (
        typeof startMonth === "string" &&
        typeof startYear.getFullYear() === "number" &&
        typeof endMonth === "string" &&
        (typeof endYear.getFullYear() === "number" ||
          typeof endYear === "string")
      ) {
        if (type === "workforce") {
          setExpierenceTest({
            type: modeType,
            payload: {
              ...state,
              startYear: startYear.getFullYear(),
              endYear: checked ? "Present" : endYear.getFullYear(),
              startMonth: startMonth,
              endMonth: checked ? "Present" : endMonth,
            },
            index: indexToModal,
          });
        } else if (type === "education") {
          setEducationTest({
            type: modeType,
            payload: {
              ...state,
              startYear: startYear.getFullYear(),
              endYear: checked ? "Present" : endYear.getFullYear(),
              startMonth: startMonth,
              endMonth: checked ? "Present" : endMonth,
            },
            index: indexToModal,
          });
        }

        setDates({
          startMonth: "january",
          startYear: new Date(),
          endMonth: "january",
          endYear: new Date(),
        });
        setOpenModel(false);
      }
    }
  };

  return (
    <Modal
      open={openModel}
      onClose={setOpenModel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form className="profile__assets__container" onSubmit={handleSubmit}>
        <h2>{`${modeType} ${origin}`}</h2>
        {renderContent()}
        <div className="edit__basic__info__btns">

          <Button
            variant="outlined"
            onClick={() => {
              if (type === "workforce" || type === "education") {
                setProfile({});
              }
              setDates({
                startMonth: "january",
                startYear: new Date(),
                endMonth: "january",
                endYear: new Date(),
              });
              setOpenModel(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={btnDisabled}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

ModelWindow.propTypes = {};
export default ModelWindow;
