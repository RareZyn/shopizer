package com.salesmanager.core.business.configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.salesmanager.core.modules.integration.payment.model.PaymentModule;
import com.salesmanager.core.modules.integration.shipping.model.ShippingQuoteModule;

/**
 * Contains injection of external shopizer starter modules
 * @author carlsamson
 * New Way - out of xml config and using spring boot starters
 *
 */
@Configuration
public class ModulesConfiguration {

	private static final Logger LOGGER = LoggerFactory.getLogger(ModulesConfiguration.class);


	/**
	 * Goes along with
	 * shipping-canadapost-spring-boot-starter
	 */
    @Autowired(required = false)
    private ShippingQuoteModule canadapost;


    /**
     * All living modules exposed here
     */
    @Autowired(required = false)
    private List<PaymentModule> liveModules;

    /**
     * Creates a map of payment modules to be injected into PaymentService
     * Map key is the bean name which should match the payment module code
     */
    @Bean(name = "paymentModules")
    public Map<String, PaymentModule> paymentModules() {
    	Map<String, PaymentModule> modules = new HashMap<>();

    	if (liveModules != null) {
    		LOGGER.info("Registering {} payment modules", liveModules.size());
    		// For now, we'll register by bean name - the FreePaymentModule is annotated with @Component("cod")
    		// In a more sophisticated setup, we'd use a convention or interface method to get the module code
    		for (PaymentModule module : liveModules) {
    			String moduleName = module.getClass().getAnnotation(org.springframework.stereotype.Component.class).value();
    			if (moduleName != null && !moduleName.isEmpty()) {
    				modules.put(moduleName, module);
    				LOGGER.info("Registered payment module: {}", moduleName);
    			}
    		}
    	} else {
    		LOGGER.warn("No payment modules found to register");
    	}

    	return modules;
    }


}
