setUp = {
    'user' : '',
    'password' : '',
    'host' : '',
    'database' : ''
}
tableName = ''

import threading
import mysql.connector
from datetime import datetime
from sense_hat import SenseHat
import pytz

sh = SenseHat()
sh.get_pressure()

def writeLog():
    cnx = mysql.connector.connect(**setUp)
    print datetime.utcnow().isoformat() + 'Z'
    cnx.cursor().execute("INSERT INTO %s VALUES (null,\"%s\", \"%s\")" % (tableName, datetime.utcnow().isoformat() + 'Z', sh.get_pressure()))
    cnx.commit()
    cnx.close()
    global mainThread
    mainThread = threading.Timer(600, writeLog)
    mainThread.start()

writeLog()

print "To exit the script, enter 0"

while(True) :
	if(raw_input() == "0"):
		print "Exiting"
		mainThread.cancel()
		break
