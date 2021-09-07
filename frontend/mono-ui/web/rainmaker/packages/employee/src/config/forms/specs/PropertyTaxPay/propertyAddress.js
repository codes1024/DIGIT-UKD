import { pincode, mohalla, street, colony, houseNumber, dummy } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/reusableFields";
import { handleFieldChange, setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { CITY } from "egov-ui-kit/utils/endPoints";
import { prepareFormData, fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import { getLocale, getTenantId, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import commonConfig from '../../../common'
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import "./index.css";

// const Search = <Icon action="action" name="home" color="#30588c" />;

const formConfig = {
  name: "propertyAddress",
  fields: {
    city: {
      id: "city",
      jsonPath: "PropertiesTemp[0].address.city",
      required: true,
      type: "singleValueList",
      floatingLabelText: "CORE_COMMON_CITY",
      className: "pt-emp-property-address-city",
      disabled: true,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      fullWidth: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      numcols: 6,
      dataFetchConfig: {
        url: CITY.GET.URL,
        action: CITY.GET.ACTION,
        queryParams: [],
        requestBody: {
          MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            moduleDetails: [
              {
                moduleName: "tenant",
                masterDetails: [
                  {
                    name: "tenants",
                  },
                ],
              },
            ],
          },
        },
        dataPath: ["MdmsRes.tenant.tenants"],
        dependants: [
          {
            fieldKey: "mohalla",
          },
        ],
      },
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        dispatch(prepareFormData("Properties[0].tenantId", field.value));
        // dispatch(setFieldProperty("propertyAddress", "mohalla", "value", ""));
        let requestBody = {
          MdmsCriteria: {
            tenantId: field.value,
            moduleDetails: [
              {
                moduleName: "PropertyTax",
                masterDetails: [
                  {
                    name: "Floor"
                  },
                  {
                    name: "OccupancyType"
                  },
                  {
                    name: "OwnerShipCategory"
                  },
                  {
                    name: "OwnerType"
                  },
                  {
                    name: "PropertySubType"
                  },
                  {
                    name: "PropertyType"
                  },
                  {
                    name: "SubOwnerShipCategory"
                  },
                  {
                    name: "UsageCategoryDetail"
                  },
                  {
                    name: "UsageCategoryMajor"
                  },
                  {
                    name: "UsageCategoryMinor"
                  },
                  {
                    name: "UsageCategorySubMinor"
                  },
                  {
                    name: "ConstructionType",
                  },
                  {
                    name: "Rebate",
                  },
                  {
                    name: "Interest",
                  },
                  {
                    name: "FireCess",
                  },
                  {
                    name: "RoadType",
                  },
                  {
                    name: "Thana",
                  }
                ]
              }
            ]
          }
        };

        dispatch(
          fetchGeneralMDMSData(requestBody, "PropertyTax", [
            "Floor",
            "OccupancyType",
            "OwnerShipCategory",
            "OwnerType",
            "PropertySubType",
            "PropertyType",
            "SubOwnerShipCategory",
            "UsageCategoryDetail",
            "UsageCategoryMajor",
            "UsageCategoryMinor",
            "UsageCategorySubMinor",
            "ConstructionType",
            "Rebate",
            "Penalty",
            "Interest",
            "FireCess",
            "RoadType",
            "Thana"
          ])
        );
        dispatch(fetchGeneralMDMSData(
          null,
          "BillingService",
          ["TaxPeriod","TaxHeadMaster"],
          "",
        //  [{masterName:"TaxPeriod",filter:"[?(@.service=='PT')]"}, {masterName:"TaxHeadMaster",filter:"[?(@.service=='PT')]"}],
          field.value
        ));
      },
      beforeFieldChange: ({ action, dispatch, state }) => {
        if (get(state, "common.prepareFormData.PropertiesTemp[0].address.city") !== action.value) {
          const moduleValue = action.value;
          dispatch(fetchLocalizationLabel(getLocale(), moduleValue, moduleValue));
        }
        return action;
      },
    },
    ...dummy,
    ...houseNumber,
    ...colony,
    ...street,
    ...mohalla,
    ...pincode,
    oldPID: {
      id: "oldpid",
      type: "textfield",
      className: "pt-old-pid-text-field-changes",
      text: "PT_SEARCH_BUTTON",
      // iconRedirectionURL: "https://pmidc.punjab.gov.in/propertymis/search.php",
      jsonPath: "Properties[0].oldPropertyId",
      floatingLabelText: "PT_PROPERTY_ADDRESS_EXISTING_PID",
      hintText: "PT_PROPERTY_ADDRESS_EXISTING_PID_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_DETAILS_PINCODE_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      toolTip: true,
      pattern: /^[^\$\"'<>?\\\\~`!@$%^+={}*,.:;“”‘’]{1,64}$/i,
      toolTipMessage: "PT_OLDPID_TOOLTIP_MESSAGE",
      maxLength: 64,
    },
    roadType: {
      id: "roadType",
      jsonPath: "Properties[0].propertyDetails[0].additionalDetails.roadType",
      //localePrefix: { moduleName: "PropertyTax", masterName: "RoadType" },
      type: "singleValueList",
      floatingLabelText: "PT_PROPERTY_ADDRESS_ROAD_TYPE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      fullWidth: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      numcols: 6,
      labelsFromLocalisation: true,
      menuHeight:"85px"
    },
   thanaType: {
      id: "Thana",
      jsonPath: "Properties[0].propertyDetails[0].additionalDetails.thana",
      //localePrefix: { moduleName: "PROPERTYTAX_THANA_", masterName: "Thana" },
      type: "singleValueList",
      floatingLabelText: "PT_PROPERTY_ADDRESS_THANA",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      fullWidth: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      numcols: 6,
      labelsFromLocalisation: true,
    }, 
  },
  afterInitForm: (action, store, dispatch) => {
    let tenantId = getTenantId();
    let state = store.getState();
    const { citiesByModule,loadMdmsData } = state.common;

    /* const roadTypeData =
        get(loadMdmsData, "PropertyTax.RoadType") &&
        Object.values(get(loadMdmsData, "PropertyTax.RoadType")).map((item, index) => {
          return { value: item.code, label: item.name };
        });

      dispatch(setFieldProperty("propertyAddress", "roadType", "dropDownData", roadTypeData));
      const locale = getLocale() || "en_IN";
      const localizationLabelsData = initLocalizationLabels(locale);
 */
    const locale = getLocale() || "en_IN";
    const localizationLabelsData = initLocalizationLabels(locale);
    const roadTypeData =
        get(loadMdmsData, "PropertyTax.RoadType") &&
        Object.values(get(loadMdmsData, "PropertyTax.RoadType")).map((item, index) => {
          return { value: item.code,
            label: getTranslatedLabel('PROPERTYTAX_ROADTYPE_' + item.code.toUpperCase(), localizationLabelsData)};
        });

      dispatch(setFieldProperty("propertyAddress", "roadType", "dropDownData", roadTypeData));

     const thanaData =
      get(loadMdmsData, "PropertyTax.Thana") &&
      Object.values(get(loadMdmsData, "PropertyTax.Thana")).map((item, index) => {

      return { value: item.code, 
        label: getTranslatedLabel(
          ('PROPERTYTAX_THANA_' + tenantId.replace(".", "_").toUpperCase() + "_" + item.code.toUpperCase()), localizationLabelsData) };
      });
      console.log("thanaData------->>>",thanaData);

      //let isRequired = process.env.REACT_APP_NAME === "Citizen"? false:true;
      let isRequired = true;

      if(window.location.href.includes('dataentry'))
      {
        isRequired=false;
      }
      
      dispatch(setFieldProperty("propertyAddress", "thanaType", "dropDownData", thanaData));
      dispatch(setFieldProperty("propertyAddress", "thanaType", "label", get(state.form.prepareFormData,'Properties[0].propertyDetails[0].additionalDetails.thana','')));
      dispatch(setFieldProperty("propertyAddress", "roadType", "label", get(state.form.prepareFormData,'Properties[0].propertyDetails[0].additionalDetails.roadType','')));
      dispatch(setFieldProperty("propertyAddress", "roadType", "required", isRequired));
      dispatch(setFieldProperty("propertyAddress", "thanaType", "required", isRequired));

    const { PT } = citiesByModule || {};
    if (PT) {
      const tenants = PT.tenants;
      let found = tenants.find((city) => {
        return city.code === tenantId;
      });

      if (found) {
        const { cities } = state.common;
        let tenantInfo = cities.find((t) => {
          if (t.code == found.code)
            return t;
        })
        let cityName = tenantId;
        if (tenantInfo && tenantInfo.city && tenantInfo.city.name)
            cityName = tenantInfo.city.name;
        dispatch(handleFieldChange("propertyAddress", "city", tenantId));
        dispatch(prepareFormData("Properties[0].address.city", cityName));
      }
    }
    set(action, "form.fields.city.required", true);
    set(action, "form.fields.pincode.disabled", false);
    return action;
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
