import { DBcommunicationError, DBconnectionError, InputError } from './Errors';

export const fetchLatestLogs = async (count, mysqlpool, cfg) => {
    const connection = await new Promise((res, rej) => {
        mysqlpool.getConnection((err, connection) => {
            if (err) {
                rej(new DBconnectionError('An error occured while trying to establish a connection to the database'));
            }
            res(connection);
        });
    });
    const rows = await new Promise((res, rej) => {
        connection.query(`SELECT * FROM ${cfg.tableName}
            ORDER BY ID DESC,ID desc LIMIT ?`, [count], (err, results) => {
            if (err) {
                rej(new DBcommunicationError('An error occured while communicating with the database, please check your inputs'));
            }
            res(results);
        });
    });

    connection.release();

    return (
        rows.map((item) => ({ datetime: item[cfg.dateColName], value: item[cfg.valueColName] }))
    );
};

export const getRowCountBetween = async (from, to, mysqlpool, cfg) => {
    const connection = await new Promise((res, rej) => {
        mysqlpool.getConnection((err, connection) => {
            if (err) {
                rej(new DBconnectionError('An error occured while trying to establish a connection to the database'));
            }
            res(connection);
        });
    });

    const rowCount = await new Promise((res, rej) => {
        connection.query(`SELECT COUNT(ID) as Count FROM ${cfg.tableName}
        WHERE ${cfg.dateColName} >= ?
        AND ${cfg.dateColName} < ?`, [from, to], (err, results) => {
            if (err) {
                rej(new DBcommunicationError('An error occured while communicating with the database, please check your inputs'));
            }
            res(results);
        });
    });

    connection.release();

    return rowCount[0].Count;
};

export const fetchChartdata = async (from, to, mysqlpool, cfg, divider) => {
    const connection = await new Promise((res, rej) => {
        mysqlpool.getConnection((err, connection) => {
            if (err) {
                rej(new DBconnectionError('An error occured while trying to establish a connection to the database'));
            }
            res(connection);
        });
    });

    const query = `SELECT * FROM
    (SELECT @row := @row +1 AS rownum, ${cfg.tableName}.* FROM
        (SELECT @row := 0) r, ${cfg.tableName}) ranked
        WHERE rownum % ${divider} = 0
        AND ${cfg.dateColName} >= ?
        AND ${cfg.dateColName} < ?`;

    const rows = await new Promise((res, rej) => {
        connection.query(query, [from, to], (err, results) => {
            if (err) {
                rej(new DBcommunicationError('An error occured while communicating with the database, please check your inputs'));
            }
            res(results);
        });
    });

    return rows.map((item) => ({ datetime: item[cfg.dateColName], value: item[cfg.valueColName] }));
};

export const checkInput = (d) => {
    if (new Date(d) == 'Invalid Date') {
        throw new InputError('Invalid input!');
    }
    else if (new Date(d).toISOString() > new Date().toISOString()) {
        throw new InputError('Entries from the future can not exist!');
    }

    return true;
};
