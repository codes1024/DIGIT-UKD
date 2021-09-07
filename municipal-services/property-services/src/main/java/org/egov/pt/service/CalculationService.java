package org.egov.pt.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Demand;
import org.egov.pt.models.Property;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.DemandRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CalculationService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private TranslationService translationService;


     public void calculateTax(AssessmentRequest assessmentRequest, Property property){
    	 
         StringBuilder uri = new StringBuilder(config.getCalculationHost())
			        		 .append(config.getCalculationContextPath())
			                 .append(config.getCalculationEndpoint());

         Map<String, Object> oldPropertyObject = translationService.translate(assessmentRequest, property);
         Object response = serviceRequestRepository.fetchResult(uri, oldPropertyObject);
         if(response == null)
             throw new CustomException("CALCULATION_ERROR","The calculation object is coming null from calculation service");
     }

     

     /**
      * Calculates the mutation fee
      * @param requestInfo RequestInfo of the request
      * @param property Property getting mutated
      */
     public void calculateMutationFee(RequestInfo requestInfo, Property property){

         PropertyRequest propertyRequest = PropertyRequest.builder()
         		.requestInfo(requestInfo)
         		.property(property)
         		.build();

 		StringBuilder url = new StringBuilder(config.getCalculationHost())
 				.append(config.getCalculationContextPath())
 				.append(config.getMutationCalculationEndpoint());

 		serviceRequestRepository.fetchResult(url, propertyRequest);
 	}

//     private CalculationReq createCalculationReq(PropertyRequest request){
//         CalculationReq calculationReq = new CalculationReq();
//         calculationReq.setRequestInfo(request.getRequestInfo());
//
//         request.getProperties().forEach(property -> {
//             CalculationCriteria calculationCriteria = new CalculationCriteria();
//             calculationCriteria.setProperty(property);
//             calculationCriteria.setTenantId(property.getTenantId());
//
//             calculationReq.addCalulationCriteriaItem(calculationCriteria);
//         });
//       return calculationReq;
//     }

	public void saveDemands(List<Demand> demands, RequestInfo requestInfo) {

		DemandRequest demandRequest = DemandRequest.builder().requestInfo(requestInfo).demands(demands).build();

		StringBuilder url = new StringBuilder(config.getCalculationHost()).append(config.getCalculationContextPath())
				.append(config.getCreateDemandEndpoint());

		serviceRequestRepository.fetchResult(url, demandRequest);

	}

	public void updateDemands(List<Demand> demands, RequestInfo requestInfo) {

		DemandRequest demandRequest = DemandRequest.builder().requestInfo(requestInfo).demands(demands).build();

		StringBuilder url = new StringBuilder(config.getCalculationHost()).append(config.getCalculationContextPath())
				.append(config.getUpdateDemandEndpoint());

		serviceRequestRepository.fetchResult(url, demandRequest);

	}
	
	/**
	 * Checks if applicable fees are present
	 * @param requestInfo
	 * @param property
	 * @return
	 */
	public String checkApplicableFees(RequestInfo requestInfo, Property property){
   	 String feesPresent = StringUtils.EMPTY;
        PropertyRequest propertyRequest = PropertyRequest.builder()
        		.requestInfo(requestInfo)
        		.property(property)
        		.build();

		StringBuilder url = new StringBuilder(config.getCalculationHost())
				.append(config.getCalculationContextPath())
				.append(config.getMutationApplicableFeesEndpoint());

		Optional<Object> response = serviceRequestRepository.fetchResult(url, propertyRequest);
		System.out.println("response ------------------- "+response);
		if (response.isPresent()) {
			Map responseMap = (Map) response.get();
			System.out.println("value ----- "+responseMap.get("feesPresent"));
			if(!responseMap.isEmpty())
				feesPresent = (String) responseMap.get("feesPresent");
		}
		return feesPresent;
	}

}
