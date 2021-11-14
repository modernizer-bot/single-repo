const gres = `const query = require("./postgres");

function gres(entity = "") {
    return new QueryBuilder(entity)
}

class QueryBuilder {
    constructor(entity = "") {
        this.entityText = entity;
        this.mainText = "";
        this.whereText = "";
        this.orderbyText = "";
        this.limitText = "";
        this.offsetText = "";
        this.returningText = "";
        this.values = [];
        this._index = 0;
    }

    select(columns = ["*"]) {
        this.mainText = \`SELECT \${columns.join(", ")} FROM \${this.entityText}\`;
        return this;
    }

    insert(entity = {}) {
        const keys = Object.keys(entity);
        const valHolders = [];
        keys.forEach((e) => {
            valHolders.push(\`$\${this.index}\`);
            this.values.push(entity[e]);
        });
        this.mainText = \`INSERT INTO \${this.entityText} (\${keys.join(", ")}) VALUES (\${valHolders.join(", ")})\`;
        return this;
    }

    delete() {
        this.mainText = \`DELETE FROM \${this.entityText}\`;
        return this;
    }

    update(entity = {}) {
        const keys = Object.keys(entity);
        const valHolders = [];
        keys.forEach((e) => {
            valHolders.push(\`\${e} = $\${this.index}\`);
            this.values.push(entity[e]);
        })
        this.mainText = \`UPDATE \${this.entityText} SET \${valHolders.join(", ")}\`;
        return this;
    }

    execute(parameters = [], isCall = false) {
        const valHolders = [];
        parameters.forEach((e) => {
            this.values.push(e)
            valHolders.push(\`$\${this.index}\`);
        })
        if (isCall) {
            this.mainText = \`CALL \${this.entityText}(\${valHolders.join(", ")})\`
        } else {
            this.mainText = \`SELECT * FROM \${this.entityText}(\${valHolders.join(", ")})\`
        }
        return this;
    }

    count() {
        this.mainText = \`SELECT count(*) FROM \${this.entityText}\`;
        return this;
    }

    where(conditions = []) {
        if(!conditions.length){
            return this;
        }
        const valHolders = [];
        conditions.forEach((e) => {
            if (e) {
                valHolders.push(\`\${e.attr} \${e.op} $\${this.index}\`);
                this.values.push(e.op === "ILIKE" ? \`\${e.val}%\` : e.val);
            } else {
                valHolders.push(\`\${e.attr} \${e.op}\`);
            }

        })
        this.whereText = \`WHERE \${valHolders.join("AND ")}\`;
        return this;
    }

    orderby({ attr = "id", drt = "asc" }) {
        this.orderbyText = \`ORDER BY "\${attr}" \${drt === "asc" ? "ASC" : "DESC"}\`;
        return this;
    }

    limit(value = 20) {
        if (value > 1000) {
            value = 1000;
        }
        this.limitText = \`LIMIT $\${this.index}\`;
        this.values.push(value);
        return this;
    }

    offset(value) {
        this.offsetText = \`OFFSET $\${this.index}\`;
        this.values.push(value);
        return this;
    }

    returning(columns = ["*"]) {
        this.returningText = \`RETURNING \${columns.join(", ")}\`;
        return this;
    }

    async run() {
        const queryObject = {
          text: \`\${this.mainText} \${this.whereText} \${this.orderbyText} \${this.limitText} \${this.offsetText} \${this.returningText};\`,
          values: this.values
        };
        const res = await query(queryObject);
        return res.rows;
    }

    get index() {
        this._index++;
        return this._index;
    }
}

module.exports = gres;

`;

module.exports = gres;
