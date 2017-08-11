var fs = require('fs');
var http = require('http');


////////////////// SEND TEXT /////////////////
var twilio = require('twilio');
// client account sid and auth token
var client = twilio('ACaa9cf232efead076ad4627d86ad4712d', 'd84a900a833a86e4ab8012449438810d');

 
// client.messages.create({ 
//     to: '+17743645669', 
//     from: '+17744625621', 
//     body: 
// }, function(err, message) { 
//     console.log(message.sid); 
// });
 
//////////////////// SEND TEXT /////////////////\


var book = {"Katrina":["Boston", "twelfth floor", "east wing"], "Daniel":["Boston", "twelfth floor", "west wing"]};

exports.handler = (event, context, callback) => {
    
    try {
         // TODO implement
    //callback(null, 'Hello from Lambda');
    
    //New Session
    if (event.session.new) {
        console.log("NEW SESSION");
    }
    switch (event.request.type) {
    //Launch Request - If I just say "ask the book"
        case "LaunchRequest":

 
            context.succeed(
               generateResponse(
                  buildSpeechletResponse("Welcome to the portal address book", true),
                  {}
                 )
                )
           console.log("LAUNCH REQUEST")
           break;

    //Intent Request - Anything with one of the sample utterances
        case "IntentRequest":
           console.log("INTENT REQUEST")
           
           switch(event.request.intent.name) {
	
               case "WhereTheySit":
				if (book[event.request.intent.slots.employee.value] != undefined) {

					client.messages.create({ 
					    to: '+17743645669', 
					    from: '+17744625621', 
					    body: event.request.intent.slots.employee.value + " works in "
							+ book[event.request.intent.slots.employee.value][0]+ " on the " + 
							book[event.request.intent.slots.employee.value][1] + " in the " +
							book[event.request.intent.slots.employee.value][2], 
					}, function(err, message) { 
					    console.log(message.sid); 
					});

                    context.succeed(
                       generateResponse(
                           buildSpeechletResponse(event.request.intent.slots.employee.value + " works in "
							+ book[event.request.intent.slots.employee.value][0]+ " on the " + 
							book[event.request.intent.slots.employee.value][1] + " in the " +
							book[event.request.intent.slots.employee.value][2], true),
                           {}
                           )
                    )}

					else {
					context.succeed(
                       generateResponse(
                           buildSpeechletResponse("Sorry, the book did not recognize that person.",true),
                           {}
                           )
                       )
					}
                       break;
				case "WhatFloor":
					if (book[event.request.intent.slots.employee.value] != undefined) {
                       buildSpeechletResponseontext.succeed(

                       generateResponse(

                           buildSpeechletResponse(book[event.request.intent.slots.employee.value][1],true),
                           {}
                           )
                       )}
					else {
					context.succeed(
                       generateResponse(
                           buildSpeechletResponse("Sorry, the book did not recognize that person.",true),
                           {}
                           )
                       )
					}
                    break;
				case "WhatOffice":
					if (book[event.request.intent.slots.employee.value] != undefined) {
                       context.succeed(

                       generateResponse(

                           buildSpeechletResponse(book[event.request.intent.slots.employee.value][0],true),
                           {}
                           )
                       )}
					else {
					   context.succeed(
                       generateResponse(
                           buildSpeechletResponse("Sorry, the book did not recognize that person.",true),
                           {}
                           )
                       )
					}
                    break;

				case "WhatWing":
					if (book[event.request.intent.slots.employee.value] != undefined) {
                       context.succeed(

                       generateResponse(

                           buildSpeechletResponse(book[event.request.intent.slots.employee.value][2],true),
                           {}
                           )
                       )}
					else {
					   context.succeed(
                       generateResponse(
                           buildSpeechletResponse("Sorry, the book did not recognize that person.",true),
                           {}
                           )
                       )
					}
                    break;
           }
           break;
    //Session Ended Request
        case "SessionEndRequest":
           console.log("SESSION END REQUEST")
           break;
        default:
           context.fail('INVALID REQUEST TYPE $(event.request.type)')
    
    }
    }
    catch(error) { context.fail('Exception: $(error)') }
    
   
};

buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}