import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import generatePdf from "../../utils/receiptPdf";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";
export const getAssmentURL = () => {	

  const propertyId = getQueryArg(	
    window.location.href,	
    "propertyId"	
  );	
  const tenantId = getQueryArg(	
    window.location.href,	
    "tenantId"	
  );
  let financialYear = localStorage.getItem('finalData')
  financialYear = financialYear && JSON.parse(financialYear);
  financialYear = financialYear && financialYear[0].financialYear;
  const path  = `/property-tax/assessment-form?assessmentId=0&purpose=assess&propertyId=${propertyId}&tenantId=${tenantId}&FY=${financialYear}`	

  return path;	

};
export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/property-tax"
    : "/pt-mutation/propertySearch";
  return redirectionURL;
};

export const getPayURL = () => {
  const applicationNumber = getQueryArg(	
    window.location.href,	
    "applicationNumber"	
  );	
  const tenantId = getQueryArg(	
    window.location.href,	
    "tenantId"	
  );
const redirectionURL = `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=PT.MUTATION`;
  return redirectionURL;
};

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "pt-apply-wizard-footer"
    },
    children
  };
};

//Function for go to home button
export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
       // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      //downloadReceiptButtonLabel: getLabel
      goToHomeButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "PT_MUTATION_HOME"
      })
    },
    // Check this onClickDefinition later again
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});

//Function for application success(show those 3 buttons )
export const applicationSuccessFooter = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  return getCommonApplyFooter({
    gotoHome: {
      componentPath: "Button",
      props: {
        className: "pt-apply-wizard-footer1",
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
        }
      },
      children: {
        //downloadReceiptButtonLabel: getLabel
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "PT_MUTATION_HOME"
        })
      },
      // Check this onClickDefinition later again
      onClickDefination: {
        action: "page_change",
        path: `${getRedirectionURL()}`
      },
     
    },
    PayMutation: {
      componentPath: "Button",
      props: {
        className: "pt-apply-wizard-footer1",
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
        }
      },
      children: {
        goToHomeButtonLabel: getLabel({
          labelName: "Pay Mutation Fee",
          labelKey: "PT_MUTATION_PAY"
        })
      },
      onClickDefination: {
        action: "page_change",
        path: `${getPayURL()}`
      },
      visible: false
     
    },
    downloadFormButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadFormButtonLabel: getLabel({
          labelName: "ACKNOWLEDGEMENT FORM",
          labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_FORM"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: () => {
          generatePdf(state, dispatch, "application_download");
        }
      },
      visible: false
    }
  });
};

export const gotoAssessment =(moduleName)=>{ //69
  
  return getCommonApplyFooter({
    gotoHome: moduleName !=null ? {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
         // minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        //downloadReceiptButtonLabel: getLabel
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "PT_ASSESSMENT"
        })
      },
      // Check this onClickDefinition later again
      onClickDefination: {
        action: "page_change",
        path: `${getAssmentURL()}`
  
      } 
    }:{},
    gotoHomeone: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
         // minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        //downloadReceiptButtonLabel: getLabel
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "PT_MUTATION_HOME"
        })
      },
      // Check this onClickDefinition later again
      onClickDefination: {
        action: "page_change",
        path: `${getRedirectionURL()}`
      }
    }
  
  });
  }
// export const gotoAssessment = getCommonApplyFooter({
//   gotoHome: {
//     componentPath: "Button",
//     props: {
//       variant: "outlined",
//       color: "primary",
//       style: {
//         // minWidth: "200px",
//         height: "48px",
//         marginRight: "46px"
//       }
//     },
//     children: {
//       //downloadReceiptButtonLabel: getLabel
//       goToHomeButtonLabel:  getLabel({
//         labelName: "GO TO HOME",
//         labelKey: "PT_ASSESSMENT"
//       })
//     },
//     // Check this onClickDefinition later again
//     onClickDefination: {
//       action: "page_change",
//       path: `${getAssmentURL()}`
//     }
//   }
// });