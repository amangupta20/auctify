import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
  Img,
} from "@react-email/components";

interface InvoiceEmailProps {
  winnerName: string;
  auctionTitle: string;
  finalPrice: number;
  itemDescription?: string;
  auctionUrl?: string;
  imageDataUrl?: string;
}

export function InvoiceEmail({
  winnerName,
  auctionTitle,
  finalPrice,
  itemDescription,
  auctionUrl,
  imageDataUrl,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif" }}>
        <Container>
          <Text>Dear {winnerName},</Text>
          <Text>
            Congratulations! You&apos;ve won the auction for &quot;
            {auctionTitle}&quot; with a winning bid of ${finalPrice.toFixed(2)}.
          </Text>

          {imageDataUrl && (
            <Img
              src={imageDataUrl}
              alt={auctionTitle}
              width="200"
              height="200"
              style={{
                maxWidth: "200px",
                height: "auto",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            />
          )}

          {itemDescription && (
            <Text>
              Item Description:
              <br />
              {itemDescription}
            </Text>
          )}

          <Hr />

          <Text>Final Invoice Amount: ${finalPrice.toFixed(2)}</Text>

          {auctionUrl && (
            <Text>
              View auction details: <Link href={auctionUrl}>{auctionUrl}</Link>
            </Text>
          )}

          <Text>
            Please process your payment soon to complete the transaction.
          </Text>

          <Text>Thank you for participating in our auction!</Text>
        </Container>
      </Body>
    </Html>
  );
}
