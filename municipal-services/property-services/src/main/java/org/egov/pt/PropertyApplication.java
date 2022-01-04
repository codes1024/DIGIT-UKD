package org.egov.pt;


import java.util.TimeZone;

import org.egov.pt.config.TenantKeyGenerator;
import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
@ComponentScan(basePackages = { "org.egov.pt", "org.egov.pt.web.controllers" , "org.egov.pt.config","org.egov.pt.repository"})
@Import({ TracerConfiguration.class })
@EnableCaching
public class PropertyApplication {

    @Value("${app.timezone}")
    private String timeZone;

    @Value("${cache.expiry.masterdata.minutes:5}")
    private long taxMasterDataCacheExpiry;

    @Bean
    public ObjectMapper objectMapper(){
    return new ObjectMapper()
    		.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true)
    		.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
    		.setTimeZone(TimeZone.getTimeZone(timeZone));
    }
    
    public static void main(String[] args) throws Exception {
        SpringApplication.run(PropertyApplication.class, args);
    }

    @Bean("tenantKeyGenerator")
    public KeyGenerator keyGenerator() {
        return new TenantKeyGenerator();
    }
    
}
