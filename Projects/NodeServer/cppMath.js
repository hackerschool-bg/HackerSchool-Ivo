// external C++ module for int addition
var sum = require('./build/Release/nodeCppSum'),
	
	// external C++ module for int multiplication
	multiply = require('./build/Release/nodeCppMultiplication'),

	// get theme settings from the config file
	theme = require('./themes.js')[config.theme];

exports.calculate = function(req, res) {
	var cppMathCall,
		result,
		html = '<head><title>Result</title></head><body style="' + theme + '"><center>' ;
	
	try{
		var cppMathCall = req.url.query.split('&');
		cppMathCall[0]=cppMathCall[0].split('=');
		cppMathCall[1]=cppMathCall[1].split('=');

		// if the arguments match those from index.html/ sent to sum.html/
		if(/Sum/.test(req.url.query)) {

			result = sum.Sum(Number(cppMathCall[0][1]), Number(cppMathCall[1][1]));

		} 
		// if the arguments match those from index.html/ sent to multiplication.html/
		else if(/Mul/.test(req.url.query)) {

			result = multiply.Multiplication(Number(cppMathCall[0][1]), Number(cppMathCall[1][1]));

		}
		
		html += '<h1> The result is: ' + result + '</h1>';
		
	} catch (e){
		html += '<h1> An error occurred. </h1>';
	}

	html += '</center></body>';
	//console.log(cppReq);
	
	res(200, { "Content-Type": "text/html" }, html);
}