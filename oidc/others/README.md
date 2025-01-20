# Other languages

For other language like PERL and GO, you can use an API to check the token
validity and return if valid, its content.

## Check the token

You can send a POST request to `https://api.epfl.ch/v1/jwt` with that body:

```json
{
    "jwt": "eyJ0eXAiOiJKV1QiL......"
}
```

## Examples

### GO

Example of Go script using the API:

```go
package main
 
import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)
 
func main() {

	url := "https://api.epfl.ch/v1/jwt"

	payload := map[string]string{"jwt": "eyJ0eXAiOiJKV1QiL......"}
 
	// Marshal the payload to JSON
	jsonData, err := json.Marshal(payload)

	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		return
	}
 
	// Create a new POST request
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))

	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
 
	// Set the Content-Type header
	req.Header.Set("Content-Type", "application/json")
 
 	// Send the request
	client := &http.Client{}

	resp, err := client.Do(req)

	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}

	defer resp.Body.Close() 

	// Check the response status
	fmt.Println("Response Status:", resp.Status)
}
```

### Perl

Example of Perl script using the API:

```perl
    my $authorization = $request->header('Authorization');

    if ($authorization && $authorization =~ /^Bearer ((?:[\w-]*\.){2}[\w-]*$)/) {
        my $token = $1;
        # get data from cache, if exists
        my $data = $jwtCache->get($token);

        # if no data, it means we haven't checked the token yet, so do it now
        unless ($data) {
            my $url = "$Config->{_}->{entra_checktoken}";
            my $lwp = new LWP::UserAgent;
            $lwp->timeout(5);
            my $req = new HTTP::Request('POST', $url, ['Content-Type' => 'application/json'],  '{"jwt": "'.$token.'"}');
            my $res = $lwp->request($req);

            if ($res->is_error) {
                #print STDERR "---------- entra API error:".Dumper($res->{_content})."\n";
                $response->status(401);
                $plugin->app->halt({});
                return 0;
            }

            #print STDERR "---------- entra API response:".Dumper($res->{_content})."\n";

            $data = slurpToJson($res->{_content});

            $jwtCache->set($token, $data);
        }

        # if token is invalid or expired, then return a 401
        #print STDERR "---------- token expiresat: $data->{expiresattimestamp}, current time: ".time()."\n";
        if (!$data || !$data->{uniqueid} || $data->{expiresattimestamp} <= time()) {
            $response->status(401);
            $plugin->app->halt({});
            return 0;
        }

        # check that jwt is binded to the right appId
        if ($data->{appid} ne $Config->{_}->{client_id}) {
            $response->status(401);
            $plugin->app->halt({});
            return 0;
        }

        return 1;
    }
```