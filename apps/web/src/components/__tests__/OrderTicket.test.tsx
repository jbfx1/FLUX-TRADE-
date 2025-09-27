import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import OrderTicket from '../OrderTicket';
import * as api from '../../services/api';

describe('OrderTicket', () => {
  it('submits orders via API', async () => {
    const spy = vi.spyOn(api, 'placeOrder').mockResolvedValue({ contract_id: '123', message: 'ok' });

    render(<OrderTicket symbol="R_100" currency="USD" />);

    fireEvent.click(screen.getByRole('button', { name: /submit order/i }));

    await waitFor(() => expect(spy).toHaveBeenCalledWith({ direction: 'RISE', stake: 10, duration: 5, symbol: 'R_100' }));
    expect(screen.getByRole('status')).toHaveTextContent('Order confirmed: 123');
  });
});
