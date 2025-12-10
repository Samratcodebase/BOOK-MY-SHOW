const HealthCheck = async (req, res) => {
  res.status(200).json({
    message: "Server Health Is Ok : 200",
  });
};

export { HealthCheck };
