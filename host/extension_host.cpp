#include <iostream>
#include <fstream>
#include <windows.h>
using namespace std;


int main(int argc, char* argv[]) {
    ofstream myfile;
    myfile.open ("C:\\extension-debug.txt");
    myfile << "Host is running...\n";
    // ======================== Read message

    unsigned int length = 0;
    char c;
    //read the first four bytes (=> Length)
    for (int i = 0; i < 4; i++) {
        c = getchar();
        length += c << i*8;
    }
    myfile << "Message from Chrome:\nLength: " << length << "\n";
    //read the json-message
    string msg = "";
    for (int i = 0; i < length; i++) {
        msg += getchar();
    }
    myfile << "Body: " << msg << "\n";

    // ======================== Process message, open explorer
    
    // Has: {"t":"file://C:/Windows"}
    // Want: file://C:/Windows
    string path = msg.substr(6, msg.length() - 6 - 2);
    myfile << "\nExtracted path: " << path << "\n\n";

    //string cmd = "explorer \"" + path + '"';
    //myfile << cmd.c_str() << "\n";
    
    myfile << "Opening path...\n";
    HINSTANCE nResult = ShellExecute(NULL, "open", path.c_str(), NULL, NULL, SW_SHOWDEFAULT);
    if ((int) nResult > 32) myfile << "Success!\n";
    else myfile << "Error: " << (int) nResult << "\n";

    // ======================== Send response
    myfile << "Sending response to extension\n";
    // Define our message
    string message = "{\"text\": \"This is a response message\"}";
    // Collect the length of the message
    unsigned int len = message.length();
    // We need to send the 4 bytes of length information
    cout 
        << char(((len >> 0) & 0xFF))
        << char(((len >> 8) & 0xFF))
        << char(((len >> 16) & 0xFF))
        << char(((len >> 24) & 0xFF));
    // Now we can output our message
    cout << message;
    
    myfile << flush;
    myfile.close();
    return 0;
}
