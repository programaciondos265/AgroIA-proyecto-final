#include <iostream>
using namespace std;

class DatabaseConnection {
private:
    static DatabaseConnection* instance;  
    DatabaseConnection() { 
        cout << "Conexión única creada" << endl; 
    }

public:
    static DatabaseConnection* getInstance() {
        if (instance == nullptr)
            instance = new DatabaseConnection();
        return instance;
    }
};

DatabaseConnection* DatabaseConnection::instance = nullptr;

int main() {
    DatabaseConnection* db1 = DatabaseConnection::getInstance();
    DatabaseConnection* db2 = DatabaseConnection::getInstance();

    cout << (db1 == db2 ? "Misma instancia" : "Instancias diferentes") << endl;
    return 0;
}
