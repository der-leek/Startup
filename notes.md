# CS260 course notes (CAN USE ON MIDTERM AND FINAL)

## GitHub Assignment
- I learned how to create and manage a git repository on my machine.
- I also learned how to store that repository on GitHub.
- Finally, I learned how to resolve merge conflicts between local and cloud repositories.

## 1/19/24
- [whisper.wasm](https://github.com/ggerganov/whisper.cpp/tree/master/examples/whisper.wasm)
- [whisper.cpp](https://github.com/ggerganov/whisper.cpp)
### whisper.cpp usage:
![](whisper_cpp_usage.jpg)

## 1/23/24
- learned how to create an AWS EC2 instance
  - public IP http://3.228.72.115
  - ssh -i /Users/derekashby/Documents/starlord-banana-landscaping.pem ubuntu@54.85.249.244

## 1/24/24
- created and set up AWS Route 53 DNS server
  - learned how to connect an IP address to a DNS domain through Route 53
  - "The additional NS and SOA type records that were listed for your domain name are important for working with DNS. These records were created automatically for you when you registered your domain name. The name server (NS) record contains the names of the authoritative name servers that authorize you to place DNS records in this DNS server. Those same authoritative name servers are listed with the registrar that you leased your domain name from. That way the authoritative name server can verify that the DNS records and the DNS registration match and are authorized to represent the domain name when defining DNS records. Otherwise a hacker could just add DNS records and take over your domain name."
  - "This wildcard represents that any subdomain will match this record"

## 2/6/24
### Common HTML elements
| element | meaning                                                                |
| ------- | ---------------------------------------------------------------------- |
| html    | The page container                                                     |
| head    | Header information                                                     |
| title   | Title of the page                                                      |
| meta    | Metadata for the page such as character set or viewport settings       |
| script  | JavaScript reference. Either a external reference, or inline           |
| include | External content reference                                             |
| body    | The entire content body of the page                                    |
| header  | Header of the main content                                             |
| footer  | Footer of the main content                                             |
| nav     | Navigational inputs                                                    |
| main    | Main content of the page                                               |
| section | A section of the main content                                          |
| aside   | Aside content from the main content                                    |
| div     | A block division of content                                            |
| span    | An inline span of content                                              |
| h<1-9>  | Text heading. From h1, the highest level, down to h9, the lowest level |
| p       | A paragraph of text                                                    |
| b       | Bring attention                                                        |
| table   | Table                                                                  |
| tr      | Table row                                                              |
| th      | Table header                                                           |
| td      | Table data                                                             |
| ol,ul   | Ordered or unordered list                                              |
| li      | List item                                                              |
| a       | Anchor the text to a hyperlink                                         |
| img     | Graphical image reference                                              |
| dialog  | Interactive component such as a confirmation                           |
| form    | A collection of user input                                             |
| input   | User input field                                                       |
| audio   | Audio content                                                          |
| video   | Video content                                                          |
| svg     | Scalable vector graphic content                                        |
| iframe  | Inline frame of another HTML page                                      |