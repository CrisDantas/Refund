//selelciona os elementos do formulario 
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//seleciona os elemento da lista 
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor
amount.oninput = () => {
    // Obtém o valor atual do input e remove os caracteres não numéricos
    let value = amount.value.replace(/\D/g, "")

    // Transformar o valor em centatos (exemplo: 150/100 = 1.5 é equivalente a R$ 1,50)
    value = Number(value) / 100

    // Atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    //formata o valor no padrao real brasileiro
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value
}

//captura o evento de submite do formulario para obter os valores 
form.onsubmit = (event) => {
    //previne o comportamento padrao de fazer o reload 
    event.preventDefault()

    //cria um objeto com os detalhes da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        creat_at: new Date(),
    }

    // Chama a função que irá adicionar o item na lista
    expenseAdd(newExpense)
}

//adiciona um novo item na lista  
function expenseAdd(newExpense) {
    try {
        // Cria o elemento para a adicionar o item (li) na lista (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Adiciona o nome e a categoria na div das informações da despesa
        expenseInfo.append(expenseName, expenseCategory)

        //cria o valor da despesa 
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        // Cria o ícone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "Remover")

        //adiciona as informaçoes no item 
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //adiciona o item na lista
        expenseList.append(expenseItem)

        //limpa o formulario para adicionar um novo item 
        formClear()
        // atualiza os totais 
        updateTotals()
    }
    catch (error) {
        alert("Nao foi possivel atualizar a lista de despesas.")
        console.log(error)
    }
}

//atualiza os totais 
function updateTotals() {
    try {
        //recupera todos os itens li da lista
        const items = expenseList.children

        //atualiza a quantidade de itens da lista 
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        //variavel para incrementar o total 
        let total = 0

        //percorre cada li da lista 
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            //remove caracteres nao numericos e substitui a virgula pelo ponto 
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            //converte o valor para float 
            value = parseFloat(value)

            //verifica se é um numero valido 
            if (isNaN(value)) {
                return alert("Nao foi possivel calcular o total. O valor nao parece ser um numero.")
            }

            //incrementa o valor total 
            total += Number(value)
        }
        //cria a span para adicionar o r$ formatado 
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        //formata o valor e remove o R$ que sera exibido pela small com um estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //limpa o conteudo do elemento
        expensesTotal.innerHTML = ""

        //adiciona o simbolo da moeda e o valor formatado
        expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Nao foi possivel atualizar os totais.")
    }
}

//evento que captura clique nos itens da lista 
expenseList.addEventListener("click", function (event) {
    //verificar se o elemento clicado é o icone de remover 
    if (event.target.classList.contains("remove-icon")) {
        //obtem a li pai do elemento clicado 
        const item = event.target.closest(".expense")

        //remove o item da lista 
        item.remove()
    }
    //atualiza os totais 
    updateTotals()
})

function formClear(){
    //limpa os inputs 
    expense.value = ""
    category.value = ""
    amount.value = ""
    
    //coloca o foco no amount 
    expense.focus()
}