import { MDMS } from "egov-ui-kit/utils/endPoints";
import { subUsageType, measuringUnit, occupancy, beforeInitFormForPlot, superArea, floorName,constructionType,innerDimensions,roomArea,balconyArea,garageArea,bathroomArea,builtArea,annualRent } from "../utils/reusableFields";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";

const formConfig = {
  name: "plotDetails",
  fields: {
    usageType: {
      id: "assessment-usageType",
      jsonPath: "Properties[0].propertyDetails[0].units[0].usageCategoryMajor",
      type: "textfield",
      floatingLabelText: "PT_FORM2_USAGE_TYPE",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      value: "Residential",
      required: true,
      disabled: true,
      numcols: 4,
    },
    //...subUsageType,
    ...occupancy,
    ...constructionType,
    ...innerDimensions,
    ...roomArea,
    ...balconyArea,
    ...garageArea,
    ...bathroomArea,
    // ...coveredArea,
    ...builtArea,
    ...superArea,
    ...measuringUnit,
    ...floorName,
    ...annualRent
  },
  isFormValid: false,
  ...beforeInitFormForPlot,
};

export default formConfig;
