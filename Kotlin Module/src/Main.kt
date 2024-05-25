// expression class for storing a mathematical expression inside an object.
class Expression(string: String) {

    private var expression: String = ""

    init{
        expression = string
    }
    fun get(): String {
        return expression
    }
    
    // find the parenthesis within the expression that takes priority.
    private fun findInwardParenthesis(formula:String): Int {
        var inwardDepth = 0
        var depthIndex = -1
        var depth = 0

        for((index, char) in formula.withIndex()){
            when(char){
                '(' -> {
                    depth++
                    if(depth > inwardDepth){
                        inwardDepth = depth
                        depthIndex = index
                    }
                }
                ')' -> depth--
            }
        }
        return depthIndex
    }
    
    // perform the arithmetic operation that is specified.
    private fun performOperation(a:Double, operator:Char, b:Double):Double{
        when(operator){
            '+' ->  return a+b
            '-' ->  return a-b
            '*' ->  return a*b
            '/' ->  return a/b
        }
        return 0.00
    }

    // use the ArrayList to determine the operation that needs to be performed.
    // ArrayList pattern = [number, operator], always ending with a number.
    private fun determineOperation(values:ArrayList<Any?>):Double {
        while(values.size != 1){
            when {
                values.contains('*') || values.contains('/') -> {
                    val multiIndex = values.indexOf('*')
                    val divIndex = values.indexOf('/')
                    val index = if (
                        divIndex > 0 && ((multiIndex > 0 && divIndex < multiIndex)
                                ||multiIndex < 1)) divIndex
                        else multiIndex
                    values[index] = performOperation(
                        values[index-1] as Double,
                        values[index] as Char,
                        values[index+1] as Double)
                    values.removeAt(index+1)
                    values.removeAt(index-1)
                }
                else -> {
                    values[0] = performOperation(
                        values[0] as Double,
                        values[1] as Char,
                        values[2] as Double)
                    values.removeAt(2)
                    values.removeAt(1)
                }
            }
        }
        return values[0] as Double
    }
    
    // solve the expression, prioritizing operations in parentheses.
    fun solution(msg:String = expression): Double {
        val operators = listOf('+','-','*','/')
        var formula = msg.replace(Regex(" "),"")
        var operand = ""
        val mathArray = ArrayList<Any?>()

        while(formula.contains('(')){
            val index = findInwardParenthesis(formula)
            var inwardExpression = formula.substring(index)
            val closeParenthesis = inwardExpression.indexOf(')')
            inwardExpression = inwardExpression.substring(1, closeParenthesis)
            val solved = solution(inwardExpression)
            formula = formula.replaceRange(index, index+closeParenthesis+1, solved.toString())
        }
        for(i in 0 until formula.length){
            val c = formula[i]

            when {
                c.isDigit() || c == '.' -> operand += c
                c == '-' -> {
                    if(i-1 >= 0){
                        if(!formula[i-1].isDigit())
                            operand += c
                        else {
                            mathArray.add(operand.toDouble())
                            operand = ""
                            mathArray.add(c)
                        }
                    }
                    else
                        operand += c
                }
                operators.contains(c) -> {
                    mathArray.add(operand.toDouble())
                    operand = ""
                    mathArray.add(c)
                }

            }
            if(i == formula.length - 1){
                mathArray.add(operand.toDouble())
            }
        }
        if(mathArray.size == 0)
            return 0.00
        return determineOperation(mathArray)
    }

}

// count the amount of times a character appears in a string.
fun countOccurrences(msg:String, char:Char):Int{
    if(msg.contains(char)){
        return 1 + countOccurrences(msg.replaceFirst(char.toString(),""), char)
    }
    return 0
}

// verify the user input expression follows an arithmetic expression pattern.
fun verifyExpression(msg:String): Boolean {
    val regExp = Regex(
        "^(\\(+)?-?[0-9]+(\\)*?[+\\-*/]\\(*?-?[0-9]+)+(\\)*)?\$"
    )
    return regExp.matches(msg.replace(" ", ""))
}

// execute the main program.
fun main(){
    println("Please enter a mathematical formula.\n"
            +"(This formula may only perform addition[+], subtraction[-], multiplication[*] and division[/])")
    val expression = readLine().toString().trim()

    /* if the expression is smaller than the simplest operation 1+1, return an error
     * illegal operators and incorrect formatting will break the expression.
     * Examples: (3**2), (10(4)+2), (2---2)
     * if parentheses do not close out and are left open, the expression is broken. */
    if( expression.length < 2
        || !verifyExpression(expression)
        || countOccurrences(expression, '(') != countOccurrences(expression, ')')) {
        println("Error, broken expression")
        return
    }
    val exp = Expression(expression)
    val answer:Double = exp.solution()
    println(answer.toString())
}