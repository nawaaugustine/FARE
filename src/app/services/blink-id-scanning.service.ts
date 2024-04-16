import { Injectable } from '@angular/core';
import * as BlinkID from '@microblink/blinkid-capacitor';
import { environment } from '../../environments/environment';  // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class BlinkIdScanningService {
  
  constructor() {
    console.log('BlinkIdScanningService initialized');
  }

  async scanDocumentMultiSide(): Promise<BlinkID.BlinkIdMultiSideRecognizerResult[]> {
    const plugin = new BlinkID.BlinkIDPlugin();
    const blinkIdMultisideRecognizer = new BlinkID.BlinkIdMultiSideRecognizer();
    blinkIdMultisideRecognizer.returnFullDocumentImage = false;
    blinkIdMultisideRecognizer.returnFaceImage = false;

    const licenseKeys: BlinkID.License = {
      ios: environment.MICROBLINK_LICENSE_KEY,
      android: environment.MICROBLINK_LICENSE_KEY,
      showTrialLicenseWarning: true
    };

    const settings = new BlinkID.BlinkIdOverlaySettings();

    try {
      const scanningResults = await plugin.scanWithCamera(
        settings,
        new BlinkID.RecognizerCollection([blinkIdMultisideRecognizer]),
        licenseKeys
      );

      if (scanningResults.length === 0) {
        console.log('No scanning results');
        return [];
      }

      // Filter results to only include instances of BlinkIdMultiSideRecognizerResult
      return scanningResults.filter(
        (        result: any) => result instanceof BlinkID.BlinkIdMultiSideRecognizerResult
      ) as BlinkID.BlinkIdMultiSideRecognizerResult[];

    } catch (error) {
      console.error('Scanning failed:', error);
      return [];
    }
  }
}
