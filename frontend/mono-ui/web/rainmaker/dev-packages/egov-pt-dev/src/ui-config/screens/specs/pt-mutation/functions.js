import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getSearchResults } from "../../../../ui-utils/commons";
import { convertDateToEpoch, getTextToLocalMapping, validateFields } from "../utils/index";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

import { ComponentJsonPath, fetchBill, getPropertyWithBillAmount } from "../pt-mutation/searchApplicationResource/applicationSearchUtils";


import {
  enableField,disableField
 } from "egov-ui-framework/ui-utils/commons";
export const propertyApplicationSearch = async (state, dispatch) => {
  searchApiCall(state, dispatch, 0)
}

export const applicationSearch = async (state, dispatch) => {
  searchApiApplicationCall(state, dispatch, 1)
}

const removeValidation = (state, dispatch, index) => {
 
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
      "props.error",
      false
    )
  );


  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
      "isFieldValid",
      true
    )
  );
  dispatch(
    handleField(
      "propertyApplicationSearch",
      "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
      "isFieldValid",
      true
    )
  );

}

const getAddress = (item) => {
  let doorNo = item.address.doorNo != null ? (item.address.doorNo + ",") : '';
  let buildingName = item.address.buildingName != null ? (item.address.buildingName + ",") : '';
  let street = item.address.street != null ? (item.address.street + ",") : '';
  let mohalla = item.address.locality.name ? (item.address.locality.name + ",") : '';
  let city = item.address.city != null ? (item.address.city) : '';
  return (doorNo + buildingName + street + mohalla + city);
}
const getIndexofActive = (item) => {

  for(let i=0;i<item.owners.length;i++)
  {
    if(item.owners[i].status=='ACTIVE')
    return i;
  }
  return 0;
}
const searchApiApplicationCall = async (state, dispatch, index) => {
  showHideTable(false, dispatch, 0);
 showHideTable(false, dispatch, 1);

 let pASearchScreenObject = get(
   state.screenConfiguration.preparedFinalObject,
   "pASearchScreen",
   {}
 );
 
 if (!pASearchScreenObject.tenantId) {
   dispatch(
     toggleSnackbar(
       true,
       {
         labelName: "Please fill valid fields to search",
         labelKey: "ERR_PT_FILL_VALID_FIELDS"
       },
       "error"
     )
   );
   return;

 } 

 let queryObject = [
    {
     key: "tenantId",
     value: pASearchScreenObject.tenantId
   } 
 ];


 let tenants = state.common.cities && state.common.cities;

  let filterTenant ;

 if (process.env.REACT_APP_NAME === "Citizen")
 {
    filterTenant = tenants && tenants.filter(m=>m.key===pASearchScreenObject.tenantId);
 }
 else
 {
    filterTenant = tenants && tenants.filter(m=>m.key===getTenantId());
 }


let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;


/*  if (index == 1 && process.env.REACT_APP_NAME == "Citizen") {
   queryObject = [];
 }


 
 let form1 = validateFields("components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails", state, dispatch, "propertyApplicationSearch");
 let form2 = validateFields("components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails", state, dispatch, "propertyApplicationSearch");
 // "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails"
 // "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails"
 // "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo"
 
 
 
 const isSearchBoxFirstRowValid = validateFields(
   "components.div.children.captureMutationDetails.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchProperty.children.searchPropertyDetails.children.ulbCityContainer.children",
   state,
   dispatch,
   "propertyApplicationSearch"
 );

 const isownerCityRowValid = validateFields(
   "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
   state,
   dispatch,
   "propertyApplicationSearch"
 );
 const isownerLocalityRowValid = validateFields(
  "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.locality",
  state,
  dispatch,
  "propertyApplicationSearch"
) || pASearchScreenObject.locality == "";
const isownerDoorNoRowValid = validateFields(
  "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.doorNo",
  state,
  dispatch,
  "propertyApplicationSearch"
) || pASearchScreenObject.doorNo == "";
const isownerNameRowValid = validateFields(
  "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerName",
  state,
  dispatch,
  "propertyApplicationSearch"
) || pASearchScreenObject.name == "";

 const isownerMobNoRowValid = validateFields(
   "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
   state,
   dispatch,
   "propertyApplicationSearch"
 ) || pASearchScreenObject.mobileNumber == '';

 const ispropertyTaxUniqueIdRowValid = validateFields(
   "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
   state,
   dispatch,
   "propertyApplicationSearch"
 ) || pASearchScreenObject.ids == '';

 const isexistingPropertyIdRowValid = validateFields(
   "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
   state,
   dispatch,
   "propertyApplicationSearch"
 ) || pASearchScreenObject.oldPropertyId == '';
 const ispropertyTaxApplicationNoRowValid = validateFields(
   "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
   state,
   dispatch,
   "propertyApplicationSearch"
 ) || pASearchScreenObject.acknowledgementIds == '';
 const ispropertyTaxApplicationOwnerNoRowValid = validateFields(
   "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
   state,
   dispatch,
   "propertyApplicationSearch"
 ) || pASearchScreenObject.mobileNumber == '';
 const ispropertyTaxApplicationPidRowValid = validateFields(
   "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
   state,
   dispatch,
   "propertyApplicationSearch"
 ) || pASearchScreenObject.ids == '';

 let formValid = false;
 if (index == 0) {
   if (pASearchScreenObject.ids != '' || pASearchScreenObject.mobileNumber != '' || pASearchScreenObject.oldPropertyId != '' || (pASearchScreenObject.locality && pASearchScreenObject.doorNo  )|| pASearchScreenObject.name != '' || pASearchScreenObject.doorNo != '' ) {
     formValid = true;
   }
 } else {
   if (pASearchScreenObject.ids != '' || pASearchScreenObject.mobileNumber != '' || pASearchScreenObject.acknowledgementIds != '') {
     formValid = true;
   }
 }
 if (!formValid) {   
   dispatch(
     toggleSnackbar(
       true,
       {
         labelName: "Please fill valid fields to search",
         labelKey: "ERR_PT_FILL_VALID_FIELDS"
       },
       "error"
     )
   );
   return;
 }


 if (!(isSearchBoxFirstRowValid)) {
   dispatch(
     toggleSnackbar(
       true,
       {
         labelName: "Please fill valid fields to search",
         labelKey: "ERR_PT_FILL_VALID_FIELDS"
       },
       "error"
     )
   );
   return;
 }
 if (index == 0 && !(isSearchBoxFirstRowValid && isownerCityRowValid && ispropertyTaxUniqueIdRowValid && isexistingPropertyIdRowValid && isownerMobNoRowValid&& isownerLocalityRowValid && isownerDoorNoRowValid && isownerNameRowValid)) {
   dispatch(
     toggleSnackbar(
       true,
       {
         labelName: "Please fill at least one field along with city",
         labelKey: "PT_INVALID_INPUT"
       },
       "error"
     )
   );
   return;
 } else if (index == 1 && !(ispropertyTaxApplicationPidRowValid && ispropertyTaxApplicationOwnerNoRowValid && ispropertyTaxApplicationNoRowValid)) {
   dispatch(
     toggleSnackbar(
       true,
       {
         labelName: "Please fill at least one field along with city",
         labelKey: "PT_INVALID_INPUT"
       },
       "error"
     )
   );
   return;
 } */


 if (
   Object.keys(pASearchScreenObject).length == 0 || Object.keys(pASearchScreenObject).length == 1 ||
   (Object.values(pASearchScreenObject).every(x => x === ""))
 ) {
  /*  dispatch(
     toggleSnackbar(
       true,
       {
         labelName: "Please fill at least one field along with city",
         labelKey: "PT_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE_OTHER_THAN_CITY"
       },
       "error"
     )
   );
   return; */
 }
 //   else if (
 //     (pASearchScreenObject["fromDate"] === undefined ||
 //       pASearchScreenObject["fromDate"].length === 0) &&
 //     pASearchScreenObject["toDate"] !== undefined &&
 //     pASearchScreenObject["toDate"].length !== 0
 //   ) {
 //     dispatch(
 //       toggleSnackbar(
 //         true,
 //         { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" },
 //         "warning"
 //       )
 //     );
 //   } 
 else {

   removeValidation(state, dispatch, index);

   //  showHideProgress(true, dispatch);
   for (var key in pASearchScreenObject) {
     if (
       pASearchScreenObject.hasOwnProperty(key) &&
       pASearchScreenObject[key].trim() !== ""
     ) {
       if (key === "fromDate") {
         queryObject.push({
           key: key,
           value: convertDateToEpoch(pASearchScreenObject[key], "daystart")
         });
       } else if (key === "tenantId") {
         // queryObject.push({
         //   key: key,
         //   value: convertDateToEpoch(pASearchScreenObject[key], "dayend")
         // });

       }
       else if (key === "ids") {
        queryObject.push({
          key: "propertyIds",
          value: tenantUniqueId && "PT-"+tenantUniqueId+"-"+pASearchScreenObject[key].trim()
        });
      }

       else if (key === "toDate") {
         queryObject.push({
           key: key,
           value: convertDateToEpoch(pASearchScreenObject[key], "dayend")
         });
       }
       // else if (key === "status") {
       //   queryObject.push({
       //     key: "action",
       //     value: pASearchScreenObject[key].trim()
       //   });
       // }
       else {
         queryObject.push({ key: key, value: pASearchScreenObject[key].trim() });
       }
     }
   }
   try {
     disableField('propertyApplicationSearch',"components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
     disableField('propertyApplicationSearch', "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
   // const response = await getSearchResults(queryObject);

     // const response = searchSampleResponse();
      /* Fuzzy serach seperate API implementation */
      /* const response = (pASearchScreenObject['doorNo'] || pASearchScreenObject['name']) && index == 0 ? await getSearchResults(queryObject, {}, "/property-services/property/fuzzy/_search") : await getSearchResults(queryObject); */
      const response = await getSearchResults(queryObject);



      let propidobj = queryObject && queryObject.find(o => o.key === "propertyIds");

      //let filtedResponse = response.find( o => o.creationReason==="PT.MUTATION");






      const billResponse = await fetchBill(dispatch, response, pASearchScreenObject.tenantId, "PT.MUTATION");

      const finalResponse = getPropertyWithBillAmount(response, billResponse);      //  const response =  await getSearchResults(queryObject);


      let PropertiesData = finalResponse.Properties

      let propertyResponse ;

      if(propidobj)
      {
        propertyResponse= PropertiesData.filter( o => o.creationReason==="MUTATION");
       
      }
      else
      {
        propertyResponse = PropertiesData;
      }

      let applicationData = propertyResponse.map(item => ({
        ["PT_COMMON_TABLE_COL_APP_NO"]:
          item || "-",
        ["PT_COMMON_TABLE_COL_PT_ID"]: item || "-",
        ["PT_COMMON_TABLE_COL_APP_TYPE"]:
          item.creationReason ? <LabelContainer labelName={"PT." + item.creationReason} labelKey={"PT." + item.creationReason} /> : "NA",
        ["PT_COMMON_TABLE_COL_OWNER_NAME"]:
          item.owners[getIndexofActive(item)].name || "-",
        ["PT_COMMON_COL_ADDRESS"]:
          getAddress(item) || "-",
        ["PT_AMOUNT_DUE"]: (item.totalAmount || item.totalAmount===0) ? item.totalAmount : "0",
        ["PT_COMMON_TABLE_COL_ACTION_LABEL"]: { status: item.status, totalAmount: item.totalAmount },
        ["TENANT_ID"]: item.tenantId,
        ["PT_COMMON_TABLE_COL_STATUS_LABEL"]: item.status || "-",
        temporary: item
      }));
     

      let propertyData = propertyResponse.map(item => ({
       ["PT_COMMON_TABLE_COL_PT_ID"]:
         item.propertyId || "-",
       ["PT_COMMON_TABLE_COL_OWNER_NAME"]: item.owners[getIndexofActive(item)].name || "-",
       ["PT_GUARDIAN_NAME"]:
         item.owners[getIndexofActive(item)].fatherOrHusbandName || "-",
       ["PT_COMMON_COL_EXISTING_PROP_ID"]:
         item.oldPropertyId || "-",
       ["PT_COMMON_COL_ADDRESS"]:
         getAddress(item) || "-",
       ["TENANT_ID"]: item.tenantId,
       ["PT_COMMON_TABLE_COL_STATUS_LABEL"]: item.status || "-"
     }));


     enableField('propertyApplicationSearch',"components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
     enableField('propertyApplicationSearch', "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
     dispatch(
       handleField(
         "propertyApplicationSearch",
         "components.div.children.searchPropertyTable",
         "props.data",
         propertyData
       )
     );
     dispatch(
       handleField(
         "propertyApplicationSearch",
         "components.div.children.searchPropertyTable",
         "props.rows",
         response.Properties.length
       )
     );
     dispatch(
       handleField(
         "propertyApplicationSearch",
         "components.div.children.searchApplicationTable",
         "props.data",
         applicationData
       )
     );
     dispatch(
       handleField(
         "propertyApplicationSearch",
         "components.div.children.searchApplicationTable",
         "props.rows",
         propertyResponse.length
       )
     );
     //showHideProgress(false, dispatch);
     showHideTable(true, dispatch, index);
   } catch (error) {
     //showHideProgress(false, dispatch);
     enableField('propertyApplicationSearch',"components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
     enableField('propertyApplicationSearch', "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
     dispatch(
       toggleSnackbar(
         true,
         { labelName: error.message, labelKey: error.message },
         "error"
       )
     );
     console.log(error);
   }
 }
};
const searchApiCall = async (state, dispatch, index) => {
   showHideTable(false, dispatch, 0);
  showHideTable(false, dispatch, 1);

  let pASearchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "pASearchScreen",
    {}
  );

   let tenants = state.common.cities && state.common.cities;

   let filterTenant ;

  if (process.env.REACT_APP_NAME === "Citizen")
  {
     filterTenant = tenants && tenants.filter(m=>m.key===pASearchScreenObject.tenantId);
  }
  else
  {
     filterTenant = tenants && tenants.filter(m=>m.key===getTenantId());
  }


 let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;


/*  if (!pASearchScreenObject.locality) {
  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "Please Select Mohalla to Search",
        labelKey: "ERR_PT_FILL_MOHALLA_VALID"
      },
      "error"
    )
  );
  return;

}  */
  if ((!pASearchScreenObject.tenantId) && index == 0) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_PT_FILL_VALID_FIELDS"
        },
        "error"
      )
    );
    return;

  } 
  let queryObject = [
    {
      key: "tenantId",
      value: pASearchScreenObject.tenantId
    }
  ];
  if (index == 1 && process.env.REACT_APP_NAME == "Citizen") {
    queryObject = [];
  }
  let form1 = validateFields("components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children", state, dispatch, "propertyApplicationSearch");
 

  let formValid = false;
  if (index == 0) {
    if (pASearchScreenObject.ids != '' || pASearchScreenObject.mobileNumber != '' || pASearchScreenObject.oldPropertyId != ''|| pASearchScreenObject.name != '' || pASearchScreenObject.doorNo != '') {
      formValid = true;
    }
  } else {
    if (pASearchScreenObject.ids != '' || pASearchScreenObject.mobileNumber != '' || pASearchScreenObject.acknowledgementIds != '') {
      formValid = true;
    }
  }
  if (!formValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_PT_FILL_VALID_FIELDS"
        },
        "error"
      )
    );
    return;
  }
  // "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails"
  // "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails"
  // "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo"
  const isSearchBoxFirstRowValid = validateFields(
  "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchProperty.children.searchPropertyDetails.children.ulbCityContainer.children",
    state,
    dispatch,
    "propertyApplicationSearch"
  );

  const isownerCityRowValid = validateFields(
    "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
    state,
    dispatch,
    "propertyApplicationSearch"
  );


  const isownerMobNoRowValid = validateFields(
    "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
    state,
    dispatch,
    "propertyApplicationSearch"
  ) || pASearchScreenObject.mobileNumber == '';

  const ispropertyTaxUniqueIdRowValid = validateFields(
    "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
    state,
    dispatch,
    "propertyApplicationSearch"
  ) || pASearchScreenObject.ids == '';

  const isexistingPropertyIdRowValid = validateFields(
    "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
    state,
    dispatch,
    "propertyApplicationSearch"
  ) || pASearchScreenObject.oldPropertyId == '';
  





  if (!(isSearchBoxFirstRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_PT_FILL_VALID_FIELDS"
        },
        "error"
      )
    );
    return;
  }
  if (index == 0 && !(isSearchBoxFirstRowValid && isownerCityRowValid && ispropertyTaxUniqueIdRowValid && isexistingPropertyIdRowValid && isownerMobNoRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field along with city",
          labelKey: "PT_INVALID_INPUT"
        },
        "error"
      )
    );
    return;
  } else if (index == 1 && !(ispropertyTaxApplicationPidRowValid && ispropertyTaxApplicationOwnerNoRowValid && ispropertyTaxApplicationNoRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field along with city",
          labelKey: "PT_INVALID_INPUT"
        },
        "error"
      )
    );
    return;
  }


  if (
    Object.keys(pASearchScreenObject).length == 0 || Object.keys(pASearchScreenObject).length == 1 ||
    (Object.values(pASearchScreenObject).every(x => x === ""))
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field along with city",
          labelKey: "PT_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE_OTHER_THAN_CITY"
        },
        "error"
      )
    );
    return;
  }
  //   else if (
  //     (pASearchScreenObject["fromDate"] === undefined ||
  //       pASearchScreenObject["fromDate"].length === 0) &&
  //     pASearchScreenObject["toDate"] !== undefined &&
  //     pASearchScreenObject["toDate"].length !== 0
  //   ) {
  //     dispatch(
  //       toggleSnackbar(
  //         true,
  //         { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" },
  //         "warning"
  //       )
  //     );
  //   } 
  else {

    removeValidation(state, dispatch, index);

    //  showHideProgress(true, dispatch);
    for (var key in pASearchScreenObject) {
      if (
        pASearchScreenObject.hasOwnProperty(key) &&
        pASearchScreenObject[key].trim() !== ""
      ) {
        if (key === "fromDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(pASearchScreenObject[key], "daystart")
          });
        } else if (key === "tenantId") {
          // queryObject.push({
          //   key: key,
          //   value: convertDateToEpoch(pASearchScreenObject[key], "dayend")
          // });

        }
        else if (key === "ids") {
          queryObject.push({
            key: "propertyIds",
            value: "PT-"+tenantUniqueId+"-"+pASearchScreenObject[key].trim()
          });
        }

        else if (key === "toDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(pASearchScreenObject[key], "dayend")
          });
        }
        // else if (key === "status") {
        //   queryObject.push({
        //     key: "action",
        //     value: pASearchScreenObject[key].trim()
        //   });
        // }
        else {
          queryObject.push({ key: key, value: pASearchScreenObject[key].trim() });
        }
      }
    }
    try {
      disableField('propertyApplicationSearch',"components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      disableField('propertyApplicationSearch', "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
     

      const response = await getSearchResults(queryObject);

      // const response = searchSampleResponse();

      let propertyData = response.Properties.map(item => ({
        ["PT_COMMON_TABLE_COL_PT_ID"]:
          item.propertyId || "-",
        ["PT_COMMON_TABLE_COL_OWNER_NAME"]: item.owners[getIndexofActive(item)].name || "-",
        ["PT_GUARDIAN_NAME"]:
          item.owners[getIndexofActive(item)].fatherOrHusbandName || "-",
        ["PT_COMMON_COL_EXISTING_PROP_ID"]:
          item.oldPropertyId || "-",
        ["PT_COMMON_COL_ADDRESS"]:
          getAddress(item) || "-",
        ["TENANT_ID"]: item.tenantId,
        ["PT_COMMON_TABLE_COL_STATUS_LABEL"]: item.status || "-"
      }));

      let applicationData = response.Properties.map(item => ({
        ["PT_COMMON_TABLE_COL_APP_NO"]:
          item || "-",
        ["PT_COMMON_TABLE_COL_PT_ID"]: item || "-",
        ["PT_COMMON_TABLE_COL_APP_TYPE"]:
          item.creationReason ? <LabelContainer labelName={"PT." + item.creationReason} labelKey={"PT." + item.creationReason} /> : "NA",
        ["PT_COMMON_TABLE_COL_OWNER_NAME"]:
          item.owners[getIndexofActive(item)].name || "-",
        ["PT_COMMON_COL_ADDRESS"]:
          getAddress(item) || "-",
        ["TENANT_ID"]: item.tenantId,
        ["PT_COMMON_TABLE_COL_STATUS_LABEL"]: item.status || "-",
        temporary: item
      }));
      enableField('propertyApplicationSearch',"components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      enableField('propertyApplicationSearch', "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      dispatch(
        handleField(
          "propertyApplicationSearch",
          "components.div.children.searchPropertyTable",
          "props.data",
          propertyData
        )
      );
      dispatch(
        handleField(
          "propertyApplicationSearch",
          "components.div.children.searchPropertyTable",
          "props.rows",
          response.Properties.length
        )
      );
      dispatch(
        handleField(
          "propertyApplicationSearch",
          "components.div.children.searchApplicationTable",
          "props.data",
          applicationData
        )
      );
      dispatch(
        handleField(
          "propertyApplicationSearch",
          "components.div.children.searchApplicationTable",
          "props.rows",
          response.Properties.length
        )
      );
      //showHideProgress(false, dispatch);
      showHideTable(true, dispatch, index);
    } catch (error) {
      //showHideProgress(false, dispatch);
      enableField('propertyApplicationSearch',"components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      enableField('propertyApplicationSearch', "components.div.children.propertyApplicationSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  }
};
const showHideTable = (booleanHideOrShow, dispatch, index) => {
  if (index == 0) {
    dispatch(
      handleField(
        "propertyApplicationSearch",
        "components.div.children.searchPropertyTable",
        "visible",
        booleanHideOrShow
      )
    );
  }
  else {
    dispatch(
      handleField(
        "propertyApplicationSearch",
        "components.div.children.searchApplicationTable",
        "visible",
        booleanHideOrShow
      )
    );
  }
};





export const downloadPrintContainer = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let ptMutationCertificateDownloadObject = {
    label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "book"
  };
  let ptMutationCertificatePrintObject = {
    label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "MT_RECEIPT" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "MT_RECEIPT" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "MT_APPLICATION" },
    link: () => {
      console.log("clicked");
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "MT_APPLICATION" },
    link: () => {
      console.log("clicked");

    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        ptMutationCertificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        ptMutationCertificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "CANCELLED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-pt",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "MT_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51",marginRight:"5px" }, className: "pt-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-pt",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "MT_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "pt-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }
};
