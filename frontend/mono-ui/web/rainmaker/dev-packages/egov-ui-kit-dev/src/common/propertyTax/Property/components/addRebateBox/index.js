import React from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import { TextField, Button, DropDown } from "components";
import {
  setFieldProperty,
  displayFormErrors
} from "egov-ui-kit/redux/form/actions";
import { validateForm } from "egov-ui-kit/redux/form/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";

const labelStyle = {
  fontFamily: "Roboto",
  fontSize: 16,
  fontWeight: 500,
  fontStyle: "normal",
  letterSpacing: 0.7,
  color: "#484848",
  marginLeft: 14
};

class AddRebateExemption extends React.Component {
  state = {
    showExtraPenaltyField: false,
    showExtraExemptField: false,
    exemptValue: null,
    initialTaxValue:0,
    isTaxValueInitialized:false
  };

  onChangePenaltyField = value => {
    let show = false;
    const { setFieldProperty } = this.props;
    if (value === "Others") {
      show = true;
      setFieldProperty(
        "additionalRebate",
        "otherPenaltyReason",
        "required",
        true
      );
    } else {
      show = false;
      setFieldProperty(
        "additionalRebate",
        "otherPenaltyReason",
        "required",
        false
      );
    }
    this.setState({
      showExtraPenaltyField: show
    });
    this.props.handleFieldChange("adhocPenaltyReason", value);
    localStorage.setItem("adhocPenaltyReason",value)
  };
  onChangeExemptField = value => {
    let show = false;
    const { setFieldProperty } = this.props;
    if (value === "Others") {
      show = true;
      setFieldProperty(
        "additionalRebate",
        "otherExemptionReason",
        "required",
        true
      );
    } else {
      show = false;
      setFieldProperty(
        "additionalRebate",
        "otherExemptionReason",
        "required",
        false
      );
    }
    this.setState({
      showExtraExemptField: show
    });
    this.props.handleFieldChange("adhocExemptionReason", value);
    localStorage.setItem("adhocExemptionReason",value);
  };
  onSubmit = () => {
    const {
      updateEstimate,
      totalAmount,
      displayFormErrors,
      adhocPenalty,
      additionalRebate,
      handleClose
    } = this.props;
    let { adhocExemption } = this.props;
    const { exemptValue } = this.state;
    adhocExemption = { ...adhocExemption, value: exemptValue };

    if (adhocExemption.value >= 0) {
      if (adhocExemption.value > sessionStorage.getItem('taxValue')) {
        if (validateForm(additionalRebate)) {
          alert(
            "Adhoc Exemption cannot be greater than the estimated tax for the given property"
          );
        } else {
          displayFormErrors("additionalRebate");
        }
      } else {
        if (validateForm(additionalRebate)) {
          exemptValue !== null &&
            this.props.handleFieldChange("adhocExemption", exemptValue);
          updateEstimate();
          handleClose()
        } else {
          displayFormErrors("additionalRebate");
        }
      }
    }
    if (adhocPenalty.value >= 0) {
      if (!validateForm(additionalRebate)) {
        displayFormErrors("additionalRebate");
      } else {
        updateEstimate();
        handleClose()
      }
    }
  };

  render() {
    const { handleFieldChange, fields,totalAmount } = this.props;
    const {
      showExtraExemptField,
      showExtraPenaltyField,
      exemptValue
    } = this.state;
    let {
      adhocPenalty,
      adhocPenaltyReason,
      adhocExemption,
      adhocExemptionReason,
      otherExemptionReason,
      otherPenaltyReason
    } = fields || {};
    if(!sessionStorage.getItem('taxValue')){
      sessionStorage.setItem('taxValue',totalAmount)
    }
    if(!this.state.isTaxValueInitialized){
     
      this.setState({
        isTaxValueInitialized:true,
        initialTaxValue:totalAmount
      })
    }
    // adhocExemption = { ...adhocExemption, value: exemptValue };
    return (
      <div className="add-rebate-box">
        <div className="pt-emp-penalty-charges col-xs-12">
          <Label
            label="PT_ADDITIONAL_CHARGES"
            className="rebate-box-labels"
            labelStyle={labelStyle}
          />
          <div className="adhocPenalty col-sm-6 col-xs-12">
            <TextField
              onChange={(e, value) =>{ handleFieldChange("adhocPenalty", value)
              prepareFinalObject("adhocExemptionPenalty.adhocPenalty",value)
              localStorage.setItem('adhocPenalty',value);
            }}
              {...adhocPenalty}
              // value = {adhocPenalty}
            />
          </div>
          <div className="adhocPenaltyReason col-sm-6 col-xs-12">
            <DropDown
              onChange={e => this.onChangePenaltyField(e.target.innerText)}
              {...adhocPenaltyReason}
            />
          </div>
          {showExtraPenaltyField && (
            <div className="col-sm-6 col-xs-12">
              <TextField
                onChange={(e, value) =>{
                  prepareFinalObject("adhocExemptionPenalty.otherPenaltyReason", value)
                  localStorage.setItem('adhocPenalty',value)}}

                fullWidth={true}
                {...otherPenaltyReason}
              />
            </div>
          )}
        </div>
        <div className="pt-emp-rebate-charges col-xs-12">
          <Label

            label="PT_ADDITIONAL_REBATE"
            labelStyle={labelStyle} />
          <div className="adhocExemption col-sm-6 col-xs-12">
           <TextField
              onChange={(e, value) =>{
                handleFieldChange("adhocExemption", value)
                prepareFinalObject("adhocExemptionPenalty.adhocExemption", value)
                localStorage.setItem('adhocExemption',value)              
              }
              }
              {...adhocExemption}
            />
          </div>
          <div className="adhocExemptionReason col-sm-6 col-xs-12">
            <DropDown
              onChange={e => this.onChangeExemptField(e.target.innerText)}
              {...adhocExemptionReason}
            />
          </div>
          {showExtraExemptField && (
            <div className="col-sm-6 col-xs-12">
              <TextField
                onChange={(e, value) =>{
                  handleFieldChange("otherExemptionReason", value)
                  prepareFinalObject("adhocExemptionPenalty.adhocOtherExemptionReason", value)
                  localStorage.setItem('adhocOtherExemptionReason',value);
                }
                }
                fullWidth={true}
                {...otherExemptionReason}
              />
            </div>
          )}
        </div>
        <div className="pt-rebate-box-btn">
          <Button
            primary={true}
            style={{
              boxShadow:
                "0 2px 5px 0 rgba(100, 100, 100, 0.5), 0 2px 10px 0 rgba(167, 167, 167, 0.5)"
            }}
            className="add-rebate-action-button"
            onClick={this.onSubmit}
            buttonLabel={true}
            label={<Label label="CS_COMMON_SUBMIT" buttonLabel={true} />}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { form,screenConfiguration } = state;
  const { additionalRebate } = form;
  const { fields } = additionalRebate || {};
  const { preparedFinalObject } = screenConfiguration;

  let { estimateResponse = [], adhocExemptionPenalty = {} } = preparedFinalObject;

  const { adhocExemption, adhocPenalty } =
    (additionalRebate && additionalRebate.fields) || {};
  return { additionalRebate, fields, adhocExemption, adhocPenalty,adhocExemptionPenalty,estimateResponse:[...estimateResponse] };
};

const mapDispatchToProps = dispatch => {
  return {
    setFieldProperty: (formKey, fieldKey, propertyName, propertyValue) =>
      dispatch(
        setFieldProperty(formKey, fieldKey, propertyName, propertyValue)
      ),
    displayFormErrors: formKey => dispatch(displayFormErrors(formKey)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRebateExemption);