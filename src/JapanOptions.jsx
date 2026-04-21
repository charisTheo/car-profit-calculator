import React from 'react';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { JAPANESE_AUCTION_SITES } from './japaneseAuctionFees';

function JapanOptions({
  includeAuctionFees,
  auctionSite,
  onAuctionSiteChange,
  japanMade,
  onJapanMadeChange,
  onIncludeAuctionFeesChange,
}) {
  return (
    <>
      {includeAuctionFees && (
        <TextField
          fullWidth
          select
          label="Auction Site"
          value={auctionSite}
          onChange={(e) => onAuctionSiteChange(e.target.value)}
          sx={{ mt: 1, mb: 1 }}
          slotProps={{ select: { native: true } }}
        >
          <option value={JAPANESE_AUCTION_SITES.AUTO_FROM_AUCTION}>AutoFromAuction</option>
          <option value={JAPANESE_AUCTION_SITES.NIKKYO}>Nikkyo</option>
        </TextField>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={japanMade}
            onChange={(e) => onJapanMadeChange(e.target.checked)}
            name="japanMade"
            color="primary"
          />
        }
        label="Japan-made 🇯🇵"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={includeAuctionFees}
            onChange={(e) => onIncludeAuctionFeesChange(e.target.checked)}
            name="includeAuctionFees"
            color="primary"
          />
        }
        label="Auction Fees"
      />
    </>
  );
}

export default JapanOptions;
