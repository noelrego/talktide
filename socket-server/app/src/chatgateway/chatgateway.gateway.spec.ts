import { Test, TestingModule } from '@nestjs/testing';
import { ChatgatewayGateway } from './chatgateway.gateway';

describe('ChatgatewayGateway', () => {
  let gateway: ChatgatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatgatewayGateway],
    }).compile();

    gateway = module.get<ChatgatewayGateway>(ChatgatewayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
