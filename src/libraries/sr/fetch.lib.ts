import { ResolutionError } from '@errors/resolution.error';
import { ResolutionLogger } from '@utilities/logger.util';
import { SuperResolutionFetchResponse } from 'types/resolution.types';

export const fetchSuperResolution = async (weights: string, fileName: string, versionId: string) => {
  try {
    const url = process.env.SR_URL!;

    ResolutionLogger.info('[SR] Fetch Super Resolution %o', {
      fileName,
      versionId,
      url,
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        weights,
        fileName,
        versionId,
      }),
    };

    const response = (await (await fetch(url, options)).json()) as SuperResolutionFetchResponse;

    ResolutionLogger.info('[SR] Super Resolution Model Response: %o', {
      response,
    });

    return response;
  } catch (error) {
    ResolutionLogger.error('[SR] Fetch Super Resolution Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ResolutionError(
      '[SR] Fetch Super Resolution',
      'Fetch Super Resolution Result Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
