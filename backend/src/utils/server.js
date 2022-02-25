exports.writeStatus = (res, err, data) => {
    if (err) {
      const status = data.status || 400;
      const message = data.message || 'Something went wrong';
      return res.status(status).json({data: {message}})
    }
    res.status(200).json({ ...data })
  }
  