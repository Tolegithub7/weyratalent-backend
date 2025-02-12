```
CREATE OR REPLACE FUNCTION update_job_posting_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date < NOW() THEN
    NEW.status := 'expired';
  ELSE
    NEW.status := 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_job_posting_status
BEFORE INSERT OR UPDATE ON job_posting
FOR EACH ROW
EXECUTE FUNCTION update_job_posting_status();
```