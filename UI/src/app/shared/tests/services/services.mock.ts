import { vi } from "vitest";
import { mock } from 'ts-mockito';
import { FormatService } from "../../services/format/format.service";
import { Web3LoginService } from "@chainbrary/web3-login";

export const formatServiceMock: FormatService = {
  formatPublicAddress: vi.fn(),
  timeStampToDate: vi.fn(),
  removeScientificNotation: vi.fn()
};

export const web3LoginServiceMock = mock(Web3LoginService);
