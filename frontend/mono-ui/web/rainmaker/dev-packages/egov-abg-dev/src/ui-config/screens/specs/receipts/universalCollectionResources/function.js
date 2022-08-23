import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { disableFieldAndShowSpinner, enableFieldAndHideSpinner, getTransformedLocale, transformById } from "egov-ui-framework/ui-utils/commons";
import { getLocalization, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getPaymentSearchResults, getPropertySearchResults} from "../../../../../ui-utils/commons";
import { convertEpochToDate, getTextToLocalMapping, validateFields,  } from "../../utils";

const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));
const transfomedKeys = transformById(localizationLabels, "code");
const tenantId = getTenantId();

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);

  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
 let workflowProperties = [];

  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.UCSearchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!isSearchBoxFirstRowValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "CR_SEARCH_SELECT_AT_LEAST_VALID_FIELD"
        },
        "warning"
      )
    );
  }
  else if (
    Object.keys(searchScreenObject).length == 0 ||
    checkEmptyFields(searchScreenObject)
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "CR_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
        },
        "warning"
      )
    );
  }
  else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && key === "businessServices" && searchScreenObject['businessServices'] != null) {
        queryObject.push({ key: key, value: searchScreenObject[key] });
      } else if (
        searchScreenObject.hasOwnProperty(key) && searchScreenObject[key] &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });

      }
    }
    disableFieldAndShowSpinner('search', "components.div.children.UCSearchCard.children.cardContent.children.buttonContainer.children.searchButton", dispatch);
    const responseFromAPI = await getPaymentSearchResults(queryObject, dispatch);
    dispatch(prepareFinalObject("receiptSearchResponse", responseFromAPI));
    const Payments = (responseFromAPI && responseFromAPI.Payments) || [];
    let response = [];
    for (let i = 0; i < Payments.length; i++) {
      const serviceTypeLabel = getTransformedLocale(
        get(Payments[i], `paymentDetails[0].bill.businessService`)
      );
      response[i] = {
        receiptNumber: get(Payments[i], `paymentDetails[0].receiptNumber`),
        payeeName: get(Payments[i], `payerName`),
        serviceType: get(Payments[i], `paymentDetails[0].bill.businessService`),
        receiptdate: get(Payments[i], `paymentDetails[0].receiptDate`),
        amount: get(Payments[i], `paymentDetails[0].bill.consumerCode`),
        status: get(Payments[i], `paymentStatus`),
        paymentMode: get(Payments[i], `paymentMode`),
        businessService: get(Payments[i], `paymentDetails[0].bill.businessService`),
        tenantId: get(Payments[i], `tenantId`),
        instrumentStatus: get(Payments[i], `instrumentStatus`),
      };
    }
    const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.uiCommonConfig");
    let convertedConfig={};
    uiConfigs.map(uiConfig=>{
      convertedConfig[uiConfig.code]={...uiConfig}
    })
    let filetedresult = [];

  if(searchScreenObject.mobileNumber)
    {
    let queryObject2 = [
      {
        key: "tenantId",
        value: tenantId
      },
      { key: "mobileNumber", value: searchScreenObject.mobileNumber }
    ];


    let result = await getPropertySearchResults(queryObject2);
    
    let propertyIds = [];
    if(result.Properties.length===0)
    {     
     for(let i=0;i<responseFromAPI.Payments.length;i++)
     {
      propertyIds[i] = responseFromAPI.Payments[i].paymentDetails[0].bill.consumerCode;
     }    
    let queryObj = [
      {
        key: "tenantId",
        value: tenantId
      },
      { key: "propertyIds", value: propertyIds }
    ];          
    result = await getPropertySearchResults(queryObj);
  }
    workflowProperties = result && result.Properties.filter(element=>
      element.status==="INWORKFLOW")  
  }

    if(searchScreenObject.mobileNumber && workflowProperties)
    {    
    let  results1 = response.filter(({ amount: id1 }) => workflowProperties.some(({ propertyId: id2 }) => id2 === id1));
    let  results2 = response.filter(({ amount: id1 }) => !results1.some(({ amount: id2 }) => id1 === id2));
     
    for(let i=0;i<results1.length;i++)
     {
      results1[i].propertystatus = "INWORKFLOW"
     }
     for(let i=0;i<results2.length;i++)
     {
      results2[i].propertystatus = "ACTIVE"
     } 
     filetedresult = [...results1, ...results2 ];   
}  

    if(searchScreenObject.receiptNumbers)
    {
       let queryObject3 = [
        {
          key: "tenantId",
          value: tenantId
        },
        { key: "propertyIds", value: response && response[0].amount }
      ];
      const result = await getPropertySearchResults(queryObject3);
      if(result && result.Properties && result.Properties[0].status ==="INWORKFLOW")
      {
        for(let i=0;i<response.length;i++)
         {
         response[i].propertystatus = "INWORKFLOW" 
         }
        filetedresult = response;
      }
      else      
      {
        for(let i=0;i<response.length;i++)
         {
         response[i].propertystatus = "ACTIVE" 
         }
        filetedresult = response;
      }
     }
     if(searchScreenObject.consumerCodes)
     {
        let queryObject4 = [
         {
           key: "tenantId",
           value: tenantId
         },
         { key: "propertyIds", value: searchScreenObject.consumerCodes }
       ];
       const result = await getPropertySearchResults(queryObject4);
       if(result && result.Properties && result.Properties[0].status ==="INWORKFLOW")
       {
         for(let i=0;i<response.length;i++)
         {
         response[i].propertystatus = "INWORKFLOW" 
         }
         filetedresult = response;
       }
       else      
       {
        for(let i=0;i<response.length;i++)
         {
         response[i].propertystatus = "ACTIVE" 
         }
         filetedresult = response;
       }
      }
    try {
      let data = filetedresult.map(item => ({
        ['CR_COMMON_TABLE_COL_RECEIPT_NO']: item.receiptNumber || "-",
        ['CR_COMMON_TABLE_COL_PAYEE_NAME']: item.payeeName || "-",
        ['CR_SERVICE_TYPE_LABEL']: getTextToLocalMapping(`BILLINGSERVICE_BUSINESSSERVICE_${item.serviceType}`) || "-",
        ['CR_COMMON_TABLE_COL_DATE']: convertEpochToDate(item.receiptdate) || "-",
        ['CR_COMMON_TABLE_CONSUMERCODE']: item.amount || "-",
        ['CR_COMMON_TABLE_COL_STATUS']: item.status || "-",
        ['CR_COMMON_TABLE_ACTION']:item.propertystatus==='ACTIVE'?((item.status!=="CANCELLED" && item.paymentMode!=="ONLINE") &&(item.instrumentStatus="APPROVED"||item.instrumentStatus=="REMITTED")&&(convertedConfig[item.businessService]?convertedConfig[item.businessService].cancelReceipt:convertedConfig['DEFAULT'].cancelReceipt)? "CANCEL":"NA"):"INWORKFLOW",
        ["RECEIPT_KEY"]: get(uiConfigs.filter(item => item.code === item.businessService), "0.receiptKey", "consolidatedreceipt"),
        ["TENANT_ID"]: item.tenantId || "-",
        ["SERVICE_TYPE"]: item.serviceType
      }));
      enableFieldAndHideSpinner('search', "components.div.children.UCSearchCard.children.cardContent.children.buttonContainer.children.searchButton", dispatch);
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.rows",
          data.length
        )
      );

      dispatch(
        handleField("search", "components.div.children.searchResults")
      );
      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
    // } else {
    //   dispatch(
    //     toggleSnackbar(
    //       true,
    //       {
    //         labelName:
    //           "Please fill atleast one more field apart from service category !",
    //         labelKey: "ERR_FILL_ONE_MORE_SEARCH_FIELD"
    //       },
    //       "warning"
    //     )
    //   );
    // }
  }
};

const checkEmptyFields = (searchScreenObject) => {
  const businessServices = get(searchScreenObject, 'businessServices', null)
  const mobileNumber = get(searchScreenObject, 'mobileNumber', null)
  const receiptNumbers = get(searchScreenObject, 'receiptNumbers', null)
  const consumerNumbers = get(searchScreenObject, 'consumerCodes', null)
  if (checkEmpty(businessServices) && checkEmpty(mobileNumber) && checkEmpty(consumerNumbers) && checkEmpty(receiptNumbers)) { return true; }
  return false;
}
const checkEmpty = (value) => {
  value = typeof (value) == "string" ? value.trim() : value;
  if (value && value != null && value.length > 0) {
    return false;
  }
  return true;
}

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
