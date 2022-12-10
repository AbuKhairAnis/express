const Ticket = require('./Ticket')
const { readFile, writeFile } = require('./utils')

const tickets = Symbol('tickets')


class TicketCollection {
    constructor() {
        (async function(){
            this[tickets]= await readFile()
        }).call(this)
    }


    /**
     * create and save new ticket
     * @param {string} username 
     * @param {number} price 
     * @return {Ticket}
     */
    create(username, price) {
        const ticket = new Ticket(username, price)
        this[tickets].push(ticket)
        writeFile( this[tickets])
        return ticket;

    }
    /**
     * 
     * returns all tickets from db 
     */
    find() {
        return this[tickets]
    }
    /**
     * return single ticket from db
     * @param {string} id 
     */
     findById(id) {
        const ticket = this[tickets].find((ticket) => ticket.id === id)
        return ticket


    }


    findByUsername(username) {
        const userTickets = this[tickets].filter(ticket => ticket.username === username)
        return userTickets
    }

    /**
     * 
     * @param {string} ticketId 
     * @param {{username: string, price: number}} ticketBody 
     * @return {Ticket}
     */

    updateById(ticketId, ticketBody) {
        const ticket = this.findById(ticketId)
        if (ticket) {
            ticket.username = ticketBody.username ?? ticket.username
            ticket.price = ticketBody.price ?? ticket.price
        }
        writeFile( this[tickets])
        return ticket
    }
    /**
     * 
     * @param {string} username 
     * @param  {{username: string, price: number}} ticketBody 
     * @return {Ticket[]}
     */

    updateBulk(username, ticketBody) {
        const userTickets = this.findByUsername(username)
        const updatedTickets = userTickets.map(
            /**
             * @param {Ticket} ticket
             */
            (ticket) => this.updateById(ticket.id, ticketBody)
        )
        writeFile( this[tickets])
        return updatedTickets
    }



    deleteById(ticketId) {
        const index = this[tickets].findIndex(
            /**
             * @param {Ticket} ticket
             */
            ticket => ticket.id === ticketId
        )
        if (index == -1) {
            return false
        }
        else {
            this[tickets].splice(index, 1)
            writeFile( this[tickets])
            return true
        }
    }
    /**
     * 
     * @param {string} username 
     * @param {number} price 
     * @param {number} quantity 
     * @return {Ticket[]}
     */
    createBulk(username, price, quantity) {
        const result = []
        for (let i = 0; i < quantity; i++) {
            const ticket = this.create(username, price)
            result.push(ticket)

        }
        writeFile( this[tickets])
        return result 
    }

    deleteBulk(username) {
        const userTickets = this.findTicketByUsername(username)
        const deletedResult = userTickets.map(

            /**
             * @param {Ticket} ticket
             */
            (ticket) => this.deleteById(ticket.id)
        )
        writeFile( this[tickets])
        return deletedResult
    }

    draw(winnerCount) {
        const winnerIndexes = new Array(winnerCount)

        let winnerIndex = 0
        while (winnerIndex < winnerCount) {
            let ticketIndex = Math.floor(Math.random() * this[tickets].length)
            if (!winnerIndexes.includes(ticketIndex)) {
                winnerIndexes[winnerIndex++] = ticketIndex
                continue 
            }
            
        }
        const winners = winnerIndexes.map(index => this[tickets][index])
        return winners
    }

}

const ticketCollection = new TicketCollection()

module.exports = ticketCollection

