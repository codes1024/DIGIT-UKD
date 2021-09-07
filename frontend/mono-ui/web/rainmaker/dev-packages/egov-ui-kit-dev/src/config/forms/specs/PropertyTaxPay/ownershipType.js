import { getOwnerDetails } from "./utils/formConfigModifier";
import set from "lodash/set";
import get from "lodash/get";
import { updateInstituteType } from "./utils/formConfigModifier";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";

const formConfig = {
  name: "ownershipType",
  fields: {
    typeOfOwnership: {
      id: "typeOfOwnership",
      jsonPath: "Properties[0].propertyDetails[0].subOwnershipCategory",
      type: "singleValueList",
      floatingLabelText: "PT_FORM3_OWNERSHIP_TYPE",
      localePrefix: "PROPERTYTAX_BILLING_SLAB",
      hintText: "PT_FORM3_OWNERSHIP_TYPE_PLACEHOLDER",
      numcols: 6,
      required: true,
      updateDependentFields: ({ formKey, field: sourceField, dispatch, state }) => {
        const { value } = sourceField;
        const institutedropDown = updateInstituteType(state, value);
        dispatch(
          prepareFormData(
            "Properties[0].propertyDetails[0].ownershipCategory",
            get(state, `common.generalMDMSDataById.SubOwnerShipCategory[${sourceField.value}].ownerShipCategory`, value)
          )
        );
        if (value.toUpperCase().indexOf("INSTITUTIONAL") !== -1) {
          dispatch(prepareFormData("Properties[0].propertyDetails[0].subOwnershipCategory", null));
        }
        dispatch(setFieldProperty("institutionDetails", "type", "dropDownData", institutedropDown));
      },
    },
  },
  beforeInitForm: (action, store) => {
    let state = store.getState();
    const { dispatch } = store;
    const ownerDetails = getOwnerDetails(state);
    const { localizationLabels } = state.app;
    ownerDetails.map((item)=>{
      item.label= getTranslatedLabel(`TL_${item.value}`,localizationLabels)
    })
     if(ownerDetails && ownerDetails.length){
      const selectedOwnerShip=get(state, "common.prepareFormData.Properties[0].propertyDetails[0].ownershipCategory");
      const ownerShipValue=selectedOwnerShip?selectedOwnerShip:ownerDetails[0].value;
      const currentOwnershipType = get(state, "form.ownershipType.fields.typeOfOwnership.value", ownerShipValue);
      set(action, "form.fields.typeOfOwnership.dropDownData", ownerDetails);
      set(action, "form.fields.typeOfOwnership.value", currentOwnershipType);
      if (ownerShipValue.toUpperCase().includes("INSTITUTIONAL")) {
        dispatch(prepareFormData("Properties[0].propertyDetails[0].subOwnershipCategory", null));
      }
      else{
        dispatch(
          prepareFormData(
            "Properties[0].propertyDetails[0].ownershipCategory",
            get(state, `common.generalMDMSDataById.SubOwnerShipCategory[${currentOwnershipType}].ownerShipCategory`)
          )
        );
        dispatch(prepareFormData("Properties[0].propertyDetails[0].subOwnershipCategory", currentOwnershipType));
    

      }
      
        
     }
    return action;
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
