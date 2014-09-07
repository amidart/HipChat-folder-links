#include <iostream>
#include <fstream>
#include <windows.h>
using namespace std;


int main(int argc, char* argv[]) {
    ofstream log;
    log.open ("C:\\HipChatLinksHelper.log", ofstream::out | ofstream::app);
    log << "Host is running...\n";
    // ======================== Read message

    unsigned int length = 0;
    char c;
    //read the first four bytes (=> Length)
    for (int i = 0; i < 4; i++) {
        c = getchar();
        length += c << i*8;
    }
    log << "Message from Chrome:\nLength: " << length << "\n";
    //read the json-message
    string msg = "";
    for (int i = 0; i < length; i++) {
        msg += getchar();
    }
    log << "Body: " << msg << "\n";

    // ======================== Process message, open explorer
    
    // Has: {"file":"file://C:/Windows/test.txt","dir":"file://C:/Windows","cmd":"opendir"}
    // Want: file://C:/Windows
    
    std::size_t pos = msg.find("\"dir\":");
    string path = msg.substr(pos + 7);
    pos = path.find("\"");
    path = path.substr(0, pos);
    log << "\nExtracted path: " << path << "\n\n";

    //string cmd = "explorer \"" + path + '"';
    //log << cmd.c_str() << "\n";
    
    log << "Opening path...\n";
    HINSTANCE nResult = ShellExecute(NULL, "open", path.c_str(), NULL, NULL, SW_SHOWDEFAULT);
    if ((int) nResult > 32) log << "Success!\n";
    else log << "Error: " << (int) nResult << "\n";

    // ======================== Send response
    log << "Sending response to extension\n";
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
    
    log << "\n==========\n\n" << flush;
    log.close();
    return 0;
}
