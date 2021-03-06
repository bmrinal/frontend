frontend
========

Repository for all front-end code

##Backend services by page

###Browse Services
### 1. All categories
    Endpoint: /resources/categories/list  
    Type: jsonp  
    Request:   
    Response: [{"id":35003,"parentId":0,"name":"EventManagement","children":[{"id":31010,"parentId":35003,"name":"AllHands","countOfServices":0,"countOfServiceDefinitions":0},{"id":35004,"parentId":35003,"name":"Birthdays","countOfServices":10,"countOfServiceDefinitions":1},{"id":40003,"parentId":35003,"name":"PressMeet","countOfServices":0,"countOfServiceDefinitions":0}],"countOfServices":10,"countOfServiceDefinitions":1},...]

### 2. All services
    Endpoint: /resources/services/list 
    Type: jsonp  
    Request:   
    Response: [{"id":177008,"createdDate":"06-19-2013 07:20:02","columns":[{"key":"haircut_blowout","values":["Without Blowout"]},{"key":"haircut_highlights","values":["Luxe salon","Play area with children's toys"]},{"key":"haircut_for","values":["Any"]},{"key":"haircut_length","values":["Any"]},{"key":"service_name","values":[""]},{"key":"duration_minutes","values":["15 minutes"]}],"wpServiceDefinitionId":66002,"wpVendorId":103001,"wpName":"serviceDefinition327 by arun - multiple images","wpProjectName":"3 images","wpStatus":"active","wpCostPerHour":0,"wpFixedCost":0,"wpOpenToQuote":false,"wpLocationId":0,"wpDuration":0,"wpImageIds":[190006,188005,183011]},...]

### 3. Services by category
    Endpoint: /resources/categories/35003
    Type: jsonp  
    Request:   
    Response: [{"id": 35003, "parentId": 0, "name": "EventManagement", "children": [{...}], "services": [{...}]}]
    
    Javascript generates a flat list of services from the above response

###Browse Providers
### 1. All providers
    Endpoint: /resources/vendors/list  
    Type: jsonp  
    Request:   
    Response: [{"id":102002,"name":"Timbuktoo Hairy Salon","phone":"777-111-0000","mobilePhone":"000-111-1223","numberOfEmployees":11,"imageIds":[292002,296002,292003],"countOfServices":8,"countOfServiceRequests":2,"descriptions":[{"description":"The institution is equipped with the latest technology in preventive, diagnostic and therapeutic imaging, along with the highest levels of in-patient monitoring, and a paperless and film-less Hospital Information System.","vendorDescriptionType":"BASIC"},{"description":" tertiary care hospital will accommodate 550 beds to fulfill the ever growing need for high quality patient care. Additionally, Artemis follows patient-centric processes conforming to International Patient Protocols, thereby establishing new standards of service and care.","vendorDescriptionType":"PASSION"}],"locations":[{"id":10001,"streetAddress1":"1 Pinky Street","streetAddress2":"Redbull Colony","city":"Orange Nagar","stateOrProvince":"Orange Nagar","zipCode":"00000"}],"contacts":[{"email":"deepak@workprotocol.com","mobilePhone":"777-111-0000","textPhone":"777-111-0000"}]}...]

This call doesn't give service details.

### 2. Provider by id
    Endpoint: resources/vendors/102002
    Type: jsonp  
    Request:   
    Response: {"id":102002,"name":"Timbuktoo Hairy Salon","phone":"777-111-0000","mobilePhone":"000-111-1223","numberOfEmployees":11,"imageIds":[296002,292002,292003],"countOfServices":8,"countOfServiceRequests":2,"descriptions":[{"description":"The institution is equipped with the latest technology in preventive, diagnostic and therapeutic imaging, along with the highest levels of in-patient monitoring, and a paperless and film-less Hospital Information System.","vendorDescriptionType":"BASIC"},{"description":" tertiary care hospital will accommodate 550 beds to fulfill the ever growing need for high quality patient care. Additionally, Artemis follows patient-centric processes conforming to International Patient Protocols, thereby establishing new standards of service and care.","vendorDescriptionType":"PASSION"}],"locations":[{"id":10001,"streetAddress1":"1 Pinky Street","streetAddress2":"Redbull Colony","city":"Orange Nagar","stateOrProvince":"Orange Nagar","zipCode":"00000"}],"contacts":[{"email":"deepak@workprotocol.com","mobilePhone":"777-111-0000","textPhone":"777-111-0000"}],"services":[{"id":188002,"createdDate":"06-17-2013 06:31:12","columns":[{"key":"chiro_xrays","values":["With X-Rays"]},{"key":"chiro_highlights","values":["Diagnose and treat musculoskeletal system problems"]},{"key":"ChiroServiceName","values":["ok"]}],"wpServiceDefinitionId":152001,"wpVendorId":102002,"wpName":"undefined by deepak","wpProjectName":"tdb","wpStatus":"active","wpCostPerHour":0.0,"wpFixedCost":50.0,"wpOpenToQuote":false,"wpLocationId":0,"wpDuration":30,"wpImageIds":[183002]},{"id":190004,"createdDate":"06-19-2013 04:08:24","columns":[{"key":"haircut_blowout","values":["Without Blowout"]},{"key":"haircut_highlights"},{"key":"haircut_for","values":["Any"]},{"key":"haircut_length","values":["Any"]},{"key":"service_name","values":[""]},{"key":"duration_minutes","values":["15 minutes"]}],"wpServiceDefinitionId":66002,"wpVendorId":102002,"wpName":"serviceDefinition327 by deepak","wpProjectName":"ii","wpStatus":"active","wpCostPerHour":0.0,"wpFixedCost":70.0,"wpOpenToQuote":true,"wpLocationId":0,"wpDuration":45,"wpImageIds":[188003,184008]},{"id":639002,"createdDate":"12-11-2013 08:06:51","columns":[{"key":"haircut_blowout","values":["With Blowout"]},{"key":"haircut_highlights","values":["Cut, style and deep conditioning treatment","Blowout style","Deep conditioning treatment","Top-quality products used","Certified organic products"]},{"key":"haircut_for","values":["Children"]},{"key":"haircut_length","values":["Long (mid-back)"]},{"key":"service_name","values":["DOGGY CUT"]},{"key":"duration_minutes","values":["1 hour 15"]}],"wpServiceDefinitionId":66002,"wpVendorId":102002,"wpName":"DOGGY CUT","wpProjectName":"","wpStatus":"active","wpCostPerHour":0.0,"wpFixedCost":200.0,"wpOpenToQuote":false,"wpLocationId":10001,"wpDuration":15,"wpImageIds":[559002,589004,549004,569005,569006,639001,589005,519002,569007,599002]},{"id":214002,"createdDate":"06-24-2013 03:25:41","columns":[{"key":"chiro_xrays","values":["Without X-Rays"]},{"key":"chiro_highlights","values":["Laser soft tissue therapy","Sacro occipital technique normalizes pelvis and head relationship"]},{"key":"ChiroServiceName","values":["TBD"]}],"wpServiceDefinitionId":152001,"wpVendorId":102002,"wpName":"Chiro 1","wpProjectName":"Chiro 1","wpStatus":"active","wpCostPerHour":0.0,"wpFixedCost":350.0,"wpOpenToQuote":true,"wpLocationId":2001,"wpDuration":60,"wpImageIds":[202006]},{"id":214001,"createdDate":"06-24-2013 03:09:07","columns":[{"key":"haircut_blowout","values":["Without Blowout"]},{"key":"haircut_highlights"},{"key":"haircut_for","values":["Any"]},{"key":"haircut_length","values":["Any"]},{"key":"service_name","values":[""]},{"key":"duration_minutes","values":["15 minutes"]}],"wpServiceDefinitionId":66002,"wpVendorId":102002,"wpName":"Children Haircut","wpProjectName":"34","wpStatus":"active","wpCostPerHour":75.0,"wpFixedCost":200.0,"wpOpenToQuote":true,"wpLocationId":2001,"wpDuration":45,"wpImageIds":[210002]},{"id":519003,"createdDate":"12-11-2013 08:52:18","columns":[{"key":"bloodtestmetabolic_highlights"},{"key":"bloodtestcardio_highlights","values":["Apo A-1","Apo B","Fibrinogen","hs-CRP","HDL","Homocysteine","LDL","Lp(a)","LpPLA2","Total Cholesterol","Triglycerides"]}],"wpServiceDefinitionId":559003,"wpVendorId":102002,"wpName":"eâ€‘Checkup","wpProjectName":"","wpStatus":"active","wpCostPerHour":0.0,"wpFixedCost":0.0,"wpOpenToQuote":false,"wpLocationId":0,"wpDuration":0,"wpImageIds":[539002,609003,639003]},{"id":539003,"createdDate":"12-11-2013 08:56:27","columns":[{"key":"bloodtestmetabolic_highlights","values":["Cortisol","Estradiol","Follicle Stimulating Hormone","Insulin","Insulin-Like Growth Factor I"]},{"key":"bloodtestcardio_highlights","values":["Apo A-1","Apo B","Fibrinogen","hs-CRP","HDL","Homocysteine","LDL","Lp(a)","LpPLA2","Total Cholesterol","Triglycerides"]}],"wpServiceDefinitionId":559003,"wpVendorId":102002,"wpName":"Baseline","wpProjectName":"Baseline","wpStatus":"active","wpCostPerHour":0.0,"wpFixedCost":1200.0,"wpOpenToQuote":false,"wpLocationId":10001,"wpDuration":30,"wpImageIds":[629005,499004]},{"id":181003,"createdDate":"06-17-2013 06:35:09","columns":[{"key":"haircut_blowout","values":["Without Blowout"]},{"key":"haircut_highlights"},{"key":"haircut_for","values":["Any"]},{"key":"haircut_length","values":["Any"]},{"key":"service_name","values":[""]},{"key":"duration_minutes","values":["15 minutes"]}],"wpServiceDefinitionId":66002,"wpVendorId":102002,"wpName":"serviceDefinition327 by deepak","wpProjectName":"ok","wpStatus":"active","wpCostPerHour":75.0,"wpFixedCost":400.0,"wpOpenToQuote":false,"wpLocationId":0,"wpDuration":75,"wpImageIds":[178004]}],"serviceRequests":[{"id":240001,"serviceId":239001,"serviceDefinitionId":66002,"createdDate":"07-01-2013 23:49:30"},{"id":262001,"serviceId":214001,"serviceDefinitionId":66002,"createdDate":"07-21-2013 22:53:30"}]}

This call provides service details along with other provider information.

### Browse specialist
### 1. All specialist
    Endpoint: /resources/user/list 
    Type: jsonp  
    Request: 
    Response: [{"userId":"110572450992977185034","nickname":"arun@workprotocol.com","email":"arun@workprotocol.com","isVendorAdmin":true,"isVendor":true,"vendorId":103001,"timeZone":"America/Los_Angeles","descriptions":[{"description":"desc","vendorDescriptionType":"SHORT_DESCRIPTION"},{"description":"specialization","vendorDescriptionType":"SPECIALIZATION"},{"description":"education","vendorDescriptionType":"EDUCATION"},{"description":"experience","vendorDescriptionType":"PROFESSIONAL_EXPERIENCE"},{"description":"languages","vendorDescriptionType":"LANGUAGES"},{"description":"registration","vendorDescriptionType":"REGISTRATION"},{"description":"awards","vendorDescriptionType":"AWARDS_AND_RECOGNITIONS"},{"description":"membership","vendorDescriptionType":"MEMBERSHIPS"}],"urls":[{"urlLocation":"blog","urlType":"WEB"},{"urlLocation":"fb","urlType":"FACEBOOK"},{"urlLocation":"linkedin","urlType":"LINKEDIN"}],"vendorUsers":[{"name":"vendoruser1","nickName":"admin@workprotocol.com","email":"admin@workprotocol.com","vendorId":103001}]}...]
    
### 2. Provider by id
    refer to the provider page call above
